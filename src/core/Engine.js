import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { eventBus, Events } from './EventBus.js';
import { SceneManager } from './SceneManager.js';
import { stateManager } from './StateManager.js';
import { GlitchSystem } from '../systems/GlitchSystem.js';

/**
 * Engine — núcleo del motor de renderizado.
 * Gestiona el render loop, Three.js, post-processing y sistemas globales.
 * Es el único punto de acceso al renderer/camera/scene principal.
 */
export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.width  = window.innerWidth;
    this.height = window.innerHeight;

    this._clock = new THREE.Clock();
    this._rafId = null;
    this._running = false;

    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initPostProcessing();
    this._initResize();
    this._initCursor();

    this.sceneManager = new SceneManager(this);
    this.glitchSystem = new GlitchSystem(this);
  }

  // ─── Initializers ──────────────────────────────────────────────────────────

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,   // desactivado para look pixelado retro
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020408);
    this.scene.fog = new THREE.FogExp2(0x020408, 0.015);
  }

  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);
  }

  _initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Bloom para emisiones de luz (pantallas rotas, neon, cables)
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      0.8,   // strength
      0.4,   // radius
      0.85   // threshold
    );
    this.composer.addPass(this.bloomPass);

    // Scanlines + viñeta — shader personalizado
    const scanlinesShader = {
      uniforms: {
        tDiffuse:    { value: null },
        uTime:       { value: 0 },
        uIntensity:  { value: 0.15 },
        uScanSpeed:  { value: 1.0 },
        uVignette:   { value: 0.6 },
        uNoise:      { value: 0.04 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uIntensity;
        uniform float uScanSpeed;
        uniform float uVignette;
        uniform float uNoise;
        varying vec2 vUv;

        float rand(vec2 co) {
          return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec4 color = texture2D(tDiffuse, vUv);

          // Scanlines
          float scan = sin(vUv.y * 800.0 + uTime * uScanSpeed * 60.0) * 0.5 + 0.5;
          color.rgb *= 1.0 - uIntensity * (1.0 - scan);

          // Film grain
          float noise = rand(vUv + fract(uTime * 0.1)) * uNoise;
          color.rgb += noise - uNoise * 0.5;

          // Vignette
          vec2 center = vUv - 0.5;
          float vign = 1.0 - dot(center, center) * uVignette * 2.0;
          color.rgb *= clamp(vign, 0.0, 1.0);

          // Leve tinte verde-cian (monitor de fósforo)
          color.rgb *= vec3(0.92, 1.0, 0.95);

          gl_FragColor = color;
        }
      `,
    };

    this.scanlinesPass = new ShaderPass(scanlinesShader);
    this.composer.addPass(this.scanlinesPass);
  }

  _initResize() {
    const onResize = () => {
      this.width  = window.innerWidth;
      this.height = window.innerHeight;

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.width, this.height);
      this.composer.setSize(this.width, this.height);
      this.bloomPass.resolution.set(this.width, this.height);

      eventBus.emit(Events.ENGINE_RESIZE, { width: this.width, height: this.height });
      this.sceneManager.resize(this.width, this.height);
    };

    window.addEventListener('resize', onResize);
    this._cleanupResize = () => window.removeEventListener('resize', onResize);
  }

  _initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    const onMove = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top  = `${e.clientY}px`;
      eventBus.emit(Events.INPUT_MOVE, {
        x: e.clientX,
        y: e.clientY,
        nx: (e.clientX / this.width)  * 2 - 1,
        ny: -(e.clientY / this.height) * 2 + 1,
      });
    };

    const onEnter = () => cursor.classList.add('active');
    const onLeave = () => cursor.classList.remove('active');

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onEnter);
    window.addEventListener('mouseup', onLeave);
    window.addEventListener('click', (e) => eventBus.emit(Events.INPUT_CLICK, { x: e.clientX, y: e.clientY }));
  }

  // ─── Loop ──────────────────────────────────────────────────────────────────

  start() {
    if (this._running) return;
    this._running = true;
    this._clock.start();
    this._tick();
    eventBus.emit(Events.ENGINE_READY);
  }

  stop() {
    this._running = false;
    cancelAnimationFrame(this._rafId);
  }

  _tick() {
    this._rafId = requestAnimationFrame(() => this._tick());

    const dt   = this._clock.getDelta();
    const time = this._clock.getElapsedTime();

    // Actualizar sistemas globales
    stateManager.tick(dt);
    this.glitchSystem.update(dt);
    this.sceneManager.update(dt);

    // Actualizar uniformes de post-processing
    if (this.scanlinesPass.uniforms.uTime) {
      this.scanlinesPass.uniforms.uTime.value = time;
    }

    // Bloom reactivo al estado del servidor
    const signal = stateManager.get('server.signalStrength') / 100;
    this.bloomPass.strength = 0.4 + signal * 0.8;

    this.composer.render();
    eventBus.emit(Events.ENGINE_TICK, { dt, time });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  addToScene(object) { this.scene.add(object); }
  removeFromScene(object) { this.scene.remove(object); }

  destroy() {
    this.stop();
    this._cleanupResize?.();
    this.renderer.dispose();
  }
}
