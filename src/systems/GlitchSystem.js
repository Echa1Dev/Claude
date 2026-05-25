import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { eventBus, Events } from '../core/EventBus.js';
import { stateManager } from '../core/StateManager.js';
import gsap from 'gsap';

/**
 * GlitchSystem — controla el efecto glitch post-proceso global.
 * Reacciona al estado del servidor: más corrupción = más glitch.
 * También puede dispararse manualmente desde narrativa o eventos.
 */
export class GlitchSystem {
  constructor(engine) {
    this.engine = engine;
    this._active = false;
    this._intensity = 0;
    this._pass = null;

    this._buildPass();
    this._listenEvents();
  }

  _buildPass() {
    const shader = {
      uniforms: {
        tDiffuse:         { value: null },
        uTime:            { value: 0 },
        uIntensity:       { value: 0 },
        uDistortionX:     { value: 0 },
        uDistortionY:     { value: 0 },
        uColorOffset:     { value: 0 },
        uBlockFrequency:  { value: 0 },
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
        uniform float uDistortionX;
        uniform float uDistortionY;
        uniform float uColorOffset;
        uniform float uBlockFrequency;
        varying vec2 vUv;

        float rand(float n) { return fract(sin(n) * 43758.5453); }
        float rand2(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }

        void main() {
          if (uIntensity < 0.001) {
            gl_FragColor = texture2D(tDiffuse, vUv);
            return;
          }

          vec2 uv = vUv;

          // Desplazamiento de bloques horizontales
          float block = floor(vUv.y * 12.0);
          float blockRand = rand(block + uTime * uBlockFrequency);
          if (blockRand > (1.0 - uIntensity * 0.6)) {
            uv.x += (rand(block) - 0.5) * uDistortionX;
          }

          // Salto vertical esporádico
          float lineRand = rand(floor(vUv.y * 80.0) + uTime * 30.0);
          if (lineRand > (1.0 - uIntensity * 0.3)) {
            uv.y += (lineRand - 0.5) * uDistortionY * 0.1;
          }

          // Aberración cromática
          float offset = uColorOffset * uIntensity;
          float r = texture2D(tDiffuse, uv + vec2( offset, 0.0)).r;
          float g = texture2D(tDiffuse, uv).g;
          float b = texture2D(tDiffuse, uv + vec2(-offset, 0.0)).b;

          vec4 color = vec4(r, g, b, 1.0);

          // Franjas de ruido
          if (rand2(vec2(vUv.y, uTime)) > (1.0 - uIntensity * 0.15)) {
            color.rgb = mix(color.rgb, vec3(0.0, rand(vUv.y), 0.8), 0.4);
          }

          gl_FragColor = color;
        }
      `,
    };

    this._pass = new ShaderPass(shader);
    this._pass.renderToScreen = false;
    this.engine.composer.addPass(this._pass);
    this._uniforms = this._pass.uniforms;
  }

  _listenEvents() {
    eventBus.on(Events.SERVER_CORRUPTED, () => this.triggerBurst(1.0, 2.0));
    eventBus.on(Events.SERVER_RECOVERED, () => this.fadeOut(1.5));
    eventBus.on(Events.SERVER_AWAKEN,    () => this.triggerBurst(0.4, 0.8));
  }

  // Pulso de glitch breve y fuerte
  triggerBurst(intensity = 0.7, duration = 0.5) {
    gsap.timeline()
      .to(this._uniforms.uIntensity,    { value: intensity, duration: 0.05 })
      .to(this._uniforms.uDistortionX,  { value: 0.15 * intensity, duration: 0.05 }, '<')
      .to(this._uniforms.uColorOffset,  { value: 0.008 * intensity, duration: 0.05 }, '<')
      .to(this._uniforms.uBlockFrequency,{ value: 3.0, duration: 0.05 }, '<')
      .to(this._uniforms.uIntensity,    { value: 0, duration, ease: 'power2.out' }, `+=${duration * 0.1}`)
      .to(this._uniforms.uDistortionX,  { value: 0, duration }, '<')
      .to(this._uniforms.uColorOffset,  { value: 0, duration }, '<')
      .to(this._uniforms.uBlockFrequency,{ value: 0, duration }, '<');
  }

  // Mantener glitch activo a nivel de fondo
  setAmbient(level) {
    const v = Math.max(0, Math.min(1, level));
    gsap.to(this._uniforms.uIntensity,     { value: v * 0.15, duration: 1.5 });
    gsap.to(this._uniforms.uColorOffset,   { value: v * 0.002, duration: 1.5 });
    gsap.to(this._uniforms.uBlockFrequency,{ value: v * 0.5, duration: 1.5 });
  }

  fadeOut(duration = 1) {
    gsap.to(this._uniforms.uIntensity,     { value: 0, duration });
    gsap.to(this._uniforms.uDistortionX,   { value: 0, duration });
    gsap.to(this._uniforms.uDistortionY,   { value: 0, duration });
    gsap.to(this._uniforms.uColorOffset,   { value: 0, duration });
    gsap.to(this._uniforms.uBlockFrequency,{ value: 0, duration });
  }

  update(dt) {
    this._uniforms.uTime.value += dt;

    // Glitch ambiental reactivo al nivel de corrupción del servidor
    const corruption = stateManager.get('server.corruptionLevel') / 100;
    const noise      = stateManager.get('world.staticNoise');
    const ambient    = corruption * 0.3 + noise * 0.1;

    // Solo actualizar si está activo (evitar GSAP conflicto)
    if (corruption > 0 || noise > 0.2) {
      this._uniforms.uDistortionX.value =
        Math.max(this._uniforms.uDistortionX.value, ambient * 0.05);
    }
  }
}
