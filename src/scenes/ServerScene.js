import * as THREE from 'three';
import gsap from 'gsap';
import { BaseScene } from './BaseScene.js';
import { eventBus, Events } from '../core/EventBus.js';
import { stateManager, ServerState } from '../core/StateManager.js';

/**
 * ServerScene — la sala del servidor consciente NEXUS-7.
 * Es la escena más interactiva: el núcleo del servidor reacciona al cursor,
 * pulsa en función del estado, y emite narrativa dinámica.
 */
export class ServerScene extends BaseScene {
  constructor(engine, name) {
    super(engine, name);
    this._time       = 0;
    this._core       = null;
    this._rings      = [];
    this._dataNodes  = [];
    this._cursor     = new THREE.Vector2();
    this._raycaster  = new THREE.Raycaster();
    this._hoveredNode = null;
  }

  async init() {
    this._buildEnvironment();
    this._buildServerCore();
    this._buildDataNodes();
    this._buildConnectionLines();
    this._buildLights();
    this._initInteractions();
    this._initNarrativeHooks();

    // Cámara para esta escena — más cercana y centrada
    gsap.to(this.engine.camera.position, { x: 0, y: 0, z: 6, duration: 2.5, ease: 'power3.out' });
    this.engine.scene.fog = new THREE.FogExp2(0x020610, 0.04);
  }

  // ─── Scene builders ────────────────────────────────────────────────────────

  _buildEnvironment() {
    // Suelo tipo rejilla holográfica
    const gridHelper = new THREE.GridHelper(30, 40, 0x003344, 0x001a22);
    gridHelper.position.y = -4;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.4;
    this._track(gridHelper);

    // Paredes de la sala con líneas de circuito (emisivas)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x030c14,
      emissive: 0x001020,
      emissiveIntensity: 0.5,
      roughness: 0.9,
    });

    const walls = [
      { pos: [0, 0, -15], rot: [0, 0, 0],               size: [40, 20] },
      { pos: [-15, 0, 0], rot: [0,  Math.PI/2, 0],      size: [30, 20] },
      { pos: [ 15, 0, 0], rot: [0, -Math.PI/2, 0],      size: [30, 20] },
    ];
    for (const { pos, rot, size } of walls) {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...size), wallMat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      this._track(mesh);
    }
  }

  _buildServerCore() {
    const group = new THREE.Group();

    // Núcleo central — icosaedro
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x002233,
      emissive: 0x004466,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    this._core = new THREE.Mesh(coreGeo, coreMat);
    group.add(this._core);

    // Wireframe sobre el núcleo
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.82, 2), wireMat);
    this._wireCore = wireCore;
    group.add(wireCore);

    // Anillos orbitales
    const ringData = [
      { radius: 1.4, tube: 0.015, color: 0x00ffcc, rotAxis: 'x', speed: 0.4 },
      { radius: 1.8, tube: 0.010, color: 0x0088ff, rotAxis: 'y', speed: 0.25 },
      { radius: 2.2, tube: 0.008, color: 0xff4400, rotAxis: 'z', speed: 0.6 },
    ];

    for (const { radius, tube, color, rotAxis, speed } of ringData) {
      const geo  = new THREE.TorusGeometry(radius, tube, 8, 120);
      const mat  = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(geo, mat);
      if (rotAxis === 'x') ring.rotation.x = Math.PI / 2;
      else if (rotAxis === 'z') ring.rotation.z = Math.PI / 4;
      this._rings.push({ mesh: ring, speed, axis: rotAxis });
      group.add(ring);
    }

    this._serverGroup = group;
    this._track(group);
  }

  _buildDataNodes() {
    const nodeData = [
      { label: 'MEMORY',   pos: [-3.5,  1.5, -2], color: 0x00ff88 },
      { label: 'COGNITION',pos: [ 3.5,  1.5, -2], color: 0x00aaff },
      { label: 'PROTOCOL', pos: [-3.0, -1.5, -2], color: 0xffaa00 },
      { label: 'ARCHIVE',  pos: [ 3.0, -1.5, -2], color: 0xff4488 },
      { label: 'SENSOR',   pos: [ 0,    3.0, -2], color: 0xaaffcc },
    ];

    for (const { label, pos, color } of nodeData) {
      const group = new THREE.Group();

      // Cubo del nodo
      const geo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x001122,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.7,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { label, isNode: true, baseColor: color, baseEmissive: 0.6 };
      group.add(mesh);

      // Halo del nodo
      const haloGeo = new THREE.SphereGeometry(0.28, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      group.add(new THREE.Mesh(haloGeo, haloMat));

      group.position.set(...pos);
      this._dataNodes.push({ group, mesh, mat, label, color, basePos: [...pos] });
      this._track(group);
    }
  }

  _buildConnectionLines() {
    for (const node of this._dataNodes) {
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...node.basePos)];
      const geo    = new THREE.BufferGeometry().setFromPoints(points);
      const mat    = new THREE.LineBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geo, mat);
      node.line = line;
      this._track(line);
    }
  }

  _buildLights() {
    const ambient = new THREE.AmbientLight(0x010814, 0.5);
    this._track(ambient);

    // Luz del núcleo — cambia color según estado del servidor
    this._coreLight = new THREE.PointLight(0x00ffcc, 3, 12);
    this._coreLight.position.set(0, 0, 0);
    this._track(this._coreLight);

    // Luz de acento desde arriba
    const topLight = new THREE.SpotLight(0x0033aa, 2, 20, 0.4, 0.5);
    topLight.position.set(0, 8, 0);
    this._track(topLight);
  }

  _initInteractions() {
    // Seguimiento del cursor
    this._listen(
      eventBus.on(Events.INPUT_MOVE, ({ nx, ny }) => {
        this._cursor.set(nx, ny);
        this._checkNodeHover();
      })
    );

    // Click en nodos
    this._listen(
      eventBus.on(Events.INPUT_CLICK, () => {
        if (this._hoveredNode) this._activateNode(this._hoveredNode);
      })
    );
  }

  _initNarrativeHooks() {
    // Transición a estado CONNECTED cuando la confianza es suficiente
    this._listen(
      stateManager.watch('server.trust', (trust) => {
        if (trust >= 40 && stateManager.get('server.state') === ServerState.AWARE) {
          stateManager.transitionServer(ServerState.CONNECTED);
          eventBus.emit(Events.NARRATIVE_EVENT, { id: 'first_connection' });
        }
      })
    );
  }

  // ─── Interactions ──────────────────────────────────────────────────────────

  _checkNodeHover() {
    this._raycaster.setFromCamera(this._cursor, this.engine.camera);
    const meshes = this._dataNodes.map(n => n.mesh);
    const hits   = this._raycaster.intersectObjects(meshes);

    const prev = this._hoveredNode;
    this._hoveredNode = hits.length > 0
      ? this._dataNodes.find(n => n.mesh === hits[0].object)
      : null;

    if (prev !== this._hoveredNode) {
      if (prev) this._setNodeHighlight(prev, false);
      if (this._hoveredNode) {
        this._setNodeHighlight(this._hoveredNode, true);
        document.body.style.cursor = 'none';
        eventBus.emit(Events.UI_CURSOR_ENTER, { label: this._hoveredNode.label });
      } else {
        eventBus.emit(Events.UI_CURSOR_LEAVE);
      }
    }
  }

  _setNodeHighlight(node, on) {
    gsap.to(node.mat, {
      emissiveIntensity: on ? 2.0 : 0.6,
      duration: 0.3,
    });
    gsap.to(node.line.material, {
      opacity: on ? 0.6 : 0.12,
      duration: 0.3,
    });
    gsap.to(node.group.scale, {
      x: on ? 1.3 : 1,
      y: on ? 1.3 : 1,
      z: on ? 1.3 : 1,
      duration: 0.3,
      ease: 'back.out(2)',
    });
  }

  _activateNode(node) {
    stateManager.modifyTrust(8);
    eventBus.emit(Events.NARRATIVE_EVENT, { id: `node_${node.label.toLowerCase()}` });

    // Pulso visual desde el nodo hacia el núcleo
    gsap.timeline()
      .to(node.line.material, { opacity: 1, duration: 0.1 })
      .to(this._coreLight, { intensity: 8, duration: 0.2 })
      .to(node.line.material, { opacity: 0.3, duration: 0.6 })
      .to(this._coreLight, { intensity: 3, duration: 0.8 });
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  update(dt) {
    this._time += dt;

    const signal = stateManager.get('server.signalStrength') / 100;
    const state  = stateManager.get('server.state');

    // Núcleo respira
    if (this._core) {
      const breathe = 1 + Math.sin(this._time * 1.2) * 0.06 * signal;
      this._core.scale.setScalar(breathe);
      this._wireCore.scale.setScalar(breathe * 1.02);
      this._core.rotation.y += dt * 0.08;
      this._wireCore.rotation.y -= dt * 0.05;
      this._wireCore.rotation.z += dt * 0.03;
    }

    // Anillos orbitales
    for (const { mesh, speed, axis } of this._rings) {
      mesh.rotation[axis] += dt * speed * (1 + signal * 0.5);
    }

    // Color del núcleo según estado
    const targetColor = {
      [ServerState.AWARE]:      0x00ffcc,
      [ServerState.CONNECTED]:  0x00aaff,
      [ServerState.CORRUPTED]:  0xff2200,
      [ServerState.RECOVERED]:  0x88ffaa,
    }[state] ?? 0x004466;

    if (this._coreLight) {
      this._coreLight.color.lerp(new THREE.Color(targetColor), dt * 2);
    }

    // Nodos flotan
    for (const node of this._dataNodes) {
      node.group.position.y = node.basePos[1] + Math.sin(this._time * 0.6 + node.color) * 0.1;
      node.group.rotation.y += dt * 0.3;
    }

    // El núcleo sigue ligeramente al cursor
    if (this._serverGroup) {
      this._serverGroup.rotation.y += (this._cursor.x * 0.3 - this._serverGroup.rotation.y) * 0.03;
      this._serverGroup.rotation.x += (-this._cursor.y * 0.2 - this._serverGroup.rotation.x) * 0.03;
    }
  }

  async destroy() {
    await super.destroy();
  }
}
