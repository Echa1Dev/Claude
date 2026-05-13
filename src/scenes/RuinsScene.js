import * as THREE from 'three';
import gsap from 'gsap';
import { BaseScene } from './BaseScene.js';
import { eventBus, Events } from '../core/EventBus.js';
import { stateManager, ServerState } from '../core/StateManager.js';

/**
 * RuinsScene — ciudad en ruinas. El usuario hace scroll para avanzar.
 * Capas de parallax: fondo lejano, edificios medios, escombros cercanos.
 * El servidor observa y comenta según el progreso del usuario.
 */
export class RuinsScene extends BaseScene {
  constructor(engine, name) {
    super(engine, name);
    this._layers     = [];
    this._ashSystem  = null;
    this._time       = 0;
    this._scrollY    = 0;
    this._targetScrollY = 0;
  }

  async init() {
    this._buildLayers();
    this._buildAshParticles();
    this._buildFloatingDebris();
    this._buildLights();
    this._initScrollBinding();

    // Posicionar cámara y animar entrada
    this.engine.camera.position.set(0, 0, 8);
    gsap.from(this.engine.camera.position, { z: 15, duration: 2, ease: 'power2.out' });

    // Fog denso para la escena de ruinas
    this.engine.scene.fog = new THREE.FogExp2(0x040810, 0.025);
  }

  // ─── Scene builders ────────────────────────────────────────────────────────

  _buildLayers() {
    const buildingData = [
      // [x, y, z, width, height, color, emissive]
      // Capa lejana — edificios altos difusos
      [-8,  1, -20, 1.5, 8, 0x0a1a2a, 0x001122],
      [-5,  2, -20, 2.0, 6, 0x0a1520, 0x001520],
      [-2, -1, -20, 1.2, 9, 0x081018, 0x000f1a],
      [ 3,  0, -20, 1.8, 7, 0x0a1a28, 0x001828],
      [ 6,  1, -20, 1.4, 5, 0x091520, 0x001520],
      [ 9, -1, -20, 2.2, 8, 0x0a1a2a, 0x001122],

      // Capa media — edificios semidestruidos
      [-7, -0.5, -10, 1.0, 5, 0x0d1f30, 0x002035],
      [-4,  0.5, -10, 0.8, 4, 0x0c1c2c, 0x001c35],
      [-1, -1.0, -10, 1.2, 6, 0x0d2030, 0x002038],
      [ 2,  0.0, -10, 0.9, 3, 0x0c1a28, 0x001a30],
      [ 5, -0.5, -10, 1.1, 5, 0x0d2032, 0x002040],
      [ 8,  0.5, -10, 1.3, 4, 0x0c1c30, 0x001c38],
    ];

    for (const [x, y, z, w, h, col, emit] of buildingData) {
      const geo = new THREE.BoxGeometry(w, h, 0.5);
      const mat = new THREE.MeshStandardMaterial({
        color:     col,
        emissive:  emit,
        emissiveIntensity: 0.8,
        roughness: 0.95,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);

      // Pequeñas ventanas con emisión aleatoria
      this._addWindowLights(mesh, w, h, z);

      this._layers.push({ mesh, baseX: x, zDepth: z });
      this._track(mesh);
    }

    // Suelo
    const floorGeo = new THREE.PlaneGeometry(60, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050e18,
      roughness: 0.99,
      metalness: 0.0,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -4, -5);
    this._track(floor);
  }

  _addWindowLights(building, width, height, z) {
    const cols = Math.floor(width * 3);
    const rows = Math.floor(height * 2);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.15) continue; // pocas ventanas encendidas
        const geo = new THREE.PlaneGeometry(0.08, 0.12);
        const mat = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.7 ? 0xff6600 : 0x004466,
          transparent: true,
          opacity: 0.4 + Math.random() * 0.4,
          blending: THREE.AdditiveBlending,
        });
        const win = new THREE.Mesh(geo, mat);
        win.position.set(
          building.position.x + (c / cols - 0.5) * width * 0.8,
          building.position.y + (r / rows - 0.5) * height * 0.8,
          z + 0.3
        );
        this._track(win);
      }
    }
  }

  _buildAshParticles() {
    const count = 1200;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(count * 3);
    const vel   = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      vel[i * 3]     = (Math.random() - 0.5) * 0.3;
      vel[i * 3 + 1] = -Math.random() * 0.2;
      vel[i * 3 + 2] = 0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this._ashVel = vel;

    const mat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x4488aa,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this._ashSystem = new THREE.Points(geo, mat);
    this._track(this._ashSystem);
  }

  _buildFloatingDebris() {
    const shapes = [
      new THREE.TetrahedronGeometry(0.1),
      new THREE.OctahedronGeometry(0.08),
      new THREE.BoxGeometry(0.12, 0.05, 0.15),
    ];
    this._debris = [];

    for (let i = 0; i < 40; i++) {
      const geo = shapes[Math.floor(Math.random() * shapes.length)].clone();
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1a3040,
        emissive: 0x001a28,
        roughness: 0.8,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 15 - 3,
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const speed = 0.2 + Math.random() * 0.5;
      this._debris.push({ mesh, speed, phase: Math.random() * Math.PI * 2 });
      this._track(mesh);
    }
  }

  _buildLights() {
    // Luz ambiental muy tenue — mundo oscuro
    const ambient = new THREE.AmbientLight(0x040810, 0.3);
    this._track(ambient);

    // Luz puntual azul-fría lejana (luna o reactor lejano)
    const moonLight = new THREE.DirectionalLight(0x0055aa, 0.4);
    moonLight.position.set(-10, 8, -5);
    this._track(moonLight);

    // Luz roja de emergencia — parpadeante
    this._emergencyLight = new THREE.PointLight(0xff2200, 2, 8);
    this._emergencyLight.position.set(3, 1, -3);
    this._track(this._emergencyLight);
  }

  _initScrollBinding() {
    this._listen(
      eventBus.on(Events.SCROLL_PROGRESS, ({ progress, velocity }) => {
        this._targetScrollY = progress * 20;
        stateManager.set('scroll.progress', progress);
        stateManager.set('scroll.velocity', velocity);

        // Confianza crece con exploración
        if (progress > 0.3) stateManager.modifyTrust(0.02);
      })
    );
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  update(dt) {
    this._time += dt;

    // Lerp suave del scroll (sensación de inercia)
    this._scrollY += (this._targetScrollY - this._scrollY) * 0.06;

    // Parallax por capas
    for (const layer of this._layers) {
      const depth  = Math.abs(layer.zDepth) / 20; // 0 = cerca, 1 = lejos
      const factor = 1 - depth * 0.7;             // cerca se mueve más
      layer.mesh.position.x = layer.baseX - this._scrollY * factor * 0.15;
    }

    // Ceniza cayendo con drift lateral
    if (this._ashSystem) {
      const pos = this._ashSystem.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i]     += this._ashVel[i]     * dt;
        pos[i + 1] += this._ashVel[i + 1] * dt;
        if (pos[i + 1] < -8) {
          pos[i + 1] = 8;
          pos[i]     = (Math.random() - 0.5) * 30;
        }
        // Pequeño drift sinusoidal
        pos[i] += Math.sin(this._time + i) * 0.001;
      }
      this._ashSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Escombros flotantes
    for (const { mesh, speed, phase } of this._debris) {
      mesh.position.y += Math.sin(this._time * speed + phase) * 0.002;
      mesh.rotation.y += dt * speed * 0.3;
      mesh.rotation.x += dt * speed * 0.15;
    }

    // Luz de emergencia parpadeante
    if (this._emergencyLight) {
      this._emergencyLight.intensity =
        1.5 + Math.sin(this._time * 3.7) * 0.5 +
        (Math.random() > 0.98 ? Math.random() * 2 : 0);
    }

    // Cámara sigue ligeramente al scroll
    this.engine.camera.position.x = this._scrollY * 0.08;
    this.engine.camera.position.y = Math.sin(this._time * 0.2) * 0.05;
  }

  async destroy() {
    await super.destroy();
  }
}
