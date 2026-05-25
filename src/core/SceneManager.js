import { eventBus, Events } from './EventBus.js';
import gsap from 'gsap';

/**
 * SceneManager — gestiona el ciclo de vida de escenas.
 * Cada escena es un módulo independiente con init/update/destroy.
 * Las transiciones entre escenas son cinematográficas con GSAP.
 */
export class SceneManager {
  constructor(engine) {
    this.engine = engine;
    this._scenes = new Map();
    this._current = null;
    this._transitioning = false;

    this._overlay = this._createOverlay();
  }

  register(name, SceneClass) {
    this._scenes.set(name, SceneClass);
  }

  async switchTo(name, transitionData = {}) {
    if (this._transitioning) return;
    if (!this._scenes.has(name)) {
      console.warn(`SceneManager: scene "${name}" not registered`);
      return;
    }

    this._transitioning = true;
    eventBus.emit(Events.SCENE_TRANSITION_OUT, { from: this._current?.name });

    // Fade out
    await gsap.to(this._overlay, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.in',
    });

    // Destruir escena actual
    if (this._current) {
      await this._current.destroy();
      this._current = null;
    }

    // Instanciar nueva escena
    const SceneClass = this._scenes.get(name);
    this._current = new SceneClass(this.engine, name);
    await this._current.init(transitionData);

    eventBus.emit(Events.SCENE_CHANGE, { to: name });

    // Fade in
    await gsap.to(this._overlay, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    });

    eventBus.emit(Events.SCENE_TRANSITION_IN, { to: name });
    this._transitioning = false;
  }

  update(dt) {
    this._current?.update(dt);
  }

  resize(w, h) {
    this._current?.resize(w, h);
  }

  _createOverlay() {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed',
      inset: '0',
      background: '#020408',
      opacity: '1',
      zIndex: '100',
      pointerEvents: 'none',
    });
    document.body.appendChild(el);
    return el;
  }
}
