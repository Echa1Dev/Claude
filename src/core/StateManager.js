import { eventBus, Events } from './EventBus.js';

/**
 * StateManager — máquina de estado del "servidor consciente" NEXUS-7.
 * Es la entidad viva central del proyecto. Su estado afecta el entorno
 * visual, la narrativa y el comportamiento de todos los sistemas.
 */

export const ServerState = Object.freeze({
  DORMANT:    'DORMANT',     // apagado, sin señal
  BOOTING:    'BOOTING',     // secuencia de arranque
  AWARE:      'AWARE',       // consciente, observando
  SUSPICIOUS: 'SUSPICIOUS',  // el usuario llama su atención
  CONNECTED:  'CONNECTED',   // conexión establecida con el usuario
  CORRUPTED:  'CORRUPTED',   // datos corruptos, glitch severo
  RECOVERED:  'RECOVERED',   // recuperado tras corrupción
});

const DEFAULT_STATE = {
  server: {
    state: ServerState.DORMANT,
    integrity: 100,      // 0–100: salud del servidor
    trust: 0,            // 0–100: confianza del servidor en el usuario
    uptime: 0,           // segundos desde el arranque
    corruptionLevel: 0,  // 0–100: nivel de corrupción actual
    signalStrength: 0,   // 0–100: intensidad de la señal
  },
  world: {
    fogDensity: 0.8,
    ambientLight: 0.05,
    radiationLevel: 0.3,
    staticNoise: 0.0,
  },
  narrative: {
    currentChapter: 0,
    unlockedLogs: [],
    choices: [],
    flags: {},
  },
  scroll: {
    progress: 0,       // 0–1 progreso global
    sectionIndex: 0,
    velocity: 0,
  },
};

class StateManager {
  constructor() {
    this._state = this._deepClone(DEFAULT_STATE);
    this._history = [];
    this._subscribers = new Map();
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this._state);
  }

  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], this._state);
    const prev = target[lastKey];

    if (prev === value) return;

    this._history.push({ path, prev, next: value, ts: performance.now() });
    target[lastKey] = value;

    this._notify(path, value, prev);
  }

  watch(path, callback) {
    if (!this._subscribers.has(path)) {
      this._subscribers.set(path, []);
    }
    this._subscribers.get(path).push(callback);
    return () => {
      const subs = this._subscribers.get(path);
      const idx = subs.indexOf(callback);
      if (idx !== -1) subs.splice(idx, 1);
    };
  }

  // Transición de estado del servidor con efectos secundarios
  transitionServer(newState) {
    const prev = this.get('server.state');
    if (prev === newState) return;

    this.set('server.state', newState);

    switch (newState) {
      case ServerState.BOOTING:
        this.set('server.signalStrength', 10);
        this.set('world.staticNoise', 0.6);
        break;
      case ServerState.AWARE:
        this.set('server.signalStrength', 60);
        this.set('world.fogDensity', 0.5);
        this.set('world.ambientLight', 0.15);
        eventBus.emit(Events.SERVER_AWAKEN);
        break;
      case ServerState.CONNECTED:
        this.set('server.trust', Math.min(100, this.get('server.trust') + 20));
        this.set('server.signalStrength', 90);
        this.set('world.ambientLight', 0.25);
        break;
      case ServerState.CORRUPTED:
        this.set('server.integrity', Math.max(0, this.get('server.integrity') - 25));
        this.set('world.staticNoise', 0.9);
        eventBus.emit(Events.SERVER_CORRUPTED);
        break;
      case ServerState.RECOVERED:
        this.set('world.staticNoise', 0.1);
        this.set('server.corruptionLevel', 0);
        eventBus.emit(Events.SERVER_RECOVERED);
        break;
    }
  }

  // Modifica la confianza del servidor según acciones del usuario
  modifyTrust(delta) {
    const current = this.get('server.trust');
    const next = Math.max(0, Math.min(100, current + delta));
    this.set('server.trust', next);
    eventBus.emit(Events.SERVER_TRUST, { trust: next, delta });
  }

  tick(dt) {
    const state = this.get('server.state');
    if (state === ServerState.DORMANT) return;

    this.set('server.uptime', this.get('server.uptime') + dt);

    if (state === ServerState.AWARE || state === ServerState.CONNECTED) {
      const pulse = Math.sin(this.get('server.uptime') * 0.5) * 0.5 + 0.5;
      this.set('server.signalStrength', 60 + pulse * 30);
    }
  }

  _notify(path, value, prev) {
    if (this._subscribers.has(path)) {
      for (const cb of this._subscribers.get(path)) {
        cb(value, prev);
      }
    }
    // Notificar paths padre también
    const parts = path.split('.');
    for (let i = parts.length - 1; i > 0; i--) {
      const parentPath = parts.slice(0, i).join('.');
      if (this._subscribers.has(parentPath)) {
        for (const cb of this._subscribers.get(parentPath)) {
          cb(this.get(parentPath), null);
        }
      }
    }
  }

  _deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}

export const stateManager = new StateManager();
