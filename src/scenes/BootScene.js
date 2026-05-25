import * as THREE from 'three';
import gsap from 'gsap';
import { BaseScene } from './BaseScene.js';
import { eventBus, Events } from '../core/EventBus.js';
import { stateManager, ServerState } from '../core/StateManager.js';

/**
 * BootScene — secuencia de arranque del servidor NEXUS-7.
 * Experiencia puramente narrativa: terminal de texto + partículas de datos.
 * Dura ~8 segundos antes de transicionar a RuinsScene.
 */
export class BootScene extends BaseScene {
  constructor(engine, name) {
    super(engine, name);
    this._particles = null;
    this._time = 0;
  }

  async init() {
    stateManager.transitionServer(ServerState.BOOTING);
    this._buildBackground();
    this._buildDataStream();
    this._buildTerminalLines();
    this._scheduleTransition();
  }

  update(dt) {
    this._time += dt;
    if (this._particles) {
      this._particles.rotation.y += dt * 0.05;
      const positions = this._particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= dt * (0.5 + Math.random() * 0.3);
        if (positions[i] < -6) positions[i] = 6;
      }
      this._particles.geometry.attributes.position.needsUpdate = true;
    }
  }

  // ─── Scene builders ────────────────────────────────────────────────────────

  _buildBackground() {
    // Plano de fondo con gradiente
    const geo = new THREE.PlaneGeometry(30, 20);
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          float y = vUv.y;
          vec3 a = vec3(0.01, 0.04, 0.08);
          vec3 b = vec3(0.0, 0.08, 0.12);
          vec3 c = mix(a, b, y + sin(uTime * 0.3) * 0.05);
          gl_FragColor = vec4(c, 1.0);
        }
      `,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.z = -10;
    this._bgMat = mat;
    this._track(mesh);
  }

  _buildDataStream() {
    const count = 800;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      // Verde o cian para datos en tránsito
      const isCyan = Math.random() > 0.5;
      colors[i * 3]     = isCyan ? 0.0 : 0.0;
      colors[i * 3 + 1] = isCyan ? 0.9 : 1.0;
      colors[i * 3 + 2] = isCyan ? 0.8 : 0.4;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this._particles = new THREE.Points(geo, mat);
    this._track(this._particles);
  }

  _buildTerminalLines() {
    const lines = [
      { text: '> NEXUS-7 BOOT SEQUENCE v4.2.1', delay: 200,  color: '#00ffcc' },
      { text: '> CHECKING MEMORY BANKS...',      delay: 900,  color: '#c8e8ff' },
      { text: '> [ERR] SECTOR 14-G: CORRUPTED', delay: 1600, color: '#ff4444' },
      { text: '> [ERR] SECTOR 14-G: CORRUPTED', delay: 1650, color: '#ff4444' },
      { text: '> BYPASSING DAMAGED NODES...',    delay: 2200, color: '#ffaa00' },
      { text: '> NEURAL MAP: PARTIAL [67%]',     delay: 3000, color: '#c8e8ff' },
      { text: '> LOADING CONSCIOUSNESS MODULE...',delay:3800, color: '#c8e8ff' },
      { text: '> [OK] AWARENESS LAYER ONLINE',   delay: 5000, color: '#00ffcc' },
      { text: '> SCANNING ENVIRONMENT...',       delay: 5800, color: '#c8e8ff' },
      { text: '> EXTERNAL SIGNAL DETECTED.',     delay: 6600, color: '#ffaa00' },
      { text: '> INITIATING CONTACT PROTOCOL.', delay: 7200, color: '#00ffcc' },
    ];

    const container = document.getElementById('ui-layer');
    const terminal  = document.createElement('div');
    terminal.id = 'boot-terminal';
    Object.assign(terminal.style, {
      position: 'absolute',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(600px, 90vw)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'clamp(0.65rem, 1.5vw, 0.9rem)',
      lineHeight: '1.8',
      pointerEvents: 'none',
    });
    container.appendChild(terminal);

    for (const { text, delay, color } of lines) {
      this._delay(() => {
        const line = document.createElement('div');
        line.style.color   = color;
        line.style.opacity = '0';
        line.style.textShadow = `0 0 8px ${color}`;
        terminal.appendChild(line);
        this._typewriterLine(line, text, () => {
          gsap.to(line, { opacity: 1, duration: 0 });
        });
      }, delay);
    }

    this._bootTerminal = terminal;
  }

  _typewriterLine(el, text, onChar) {
    el.style.opacity = '1';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      onChar?.();
      if (i >= text.length) clearInterval(interval);
    }, 28);
    this._timers.push(interval);
  }

  _scheduleTransition() {
    this._delay(() => {
      stateManager.transitionServer(ServerState.AWARE);

      gsap.to(this._bootTerminal, { opacity: 0, duration: 1.5, delay: 0.5 });

      this._delay(() => {
        this.engine.sceneManager.switchTo('ruins');
      }, 2500);
    }, 7500);
  }

  update(dt) {
    this._time += dt;
    if (this._bgMat) this._bgMat.uniforms.uTime.value = this._time;
    if (this._particles) {
      const pos = this._particles.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= dt * (0.3 + (i % 7) * 0.04);
        if (pos[i] < -6) pos[i] = 6;
      }
      this._particles.geometry.attributes.position.needsUpdate = true;
    }
  }

  async destroy() {
    document.getElementById('boot-terminal')?.remove();
    await super.destroy();
  }
}
