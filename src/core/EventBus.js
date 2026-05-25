/**
 * EventBus — pub/sub global desacoplado.
 * Toda comunicación entre sistemas pasa por aquí.
 * Evita imports cruzados entre módulos independientes.
 */
class EventBus {
  constructor() {
    this._listeners = new Map();
  }

  on(event, callback, context = null) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push({ callback, context });
    return () => this.off(event, callback);
  }

  once(event, callback, context = null) {
    const wrapper = (data) => {
      callback.call(context, data);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off(event, callback) {
    if (!this._listeners.has(event)) return;
    const filtered = this._listeners.get(event).filter(l => l.callback !== callback);
    this._listeners.set(event, filtered);
  }

  emit(event, data = {}) {
    if (!this._listeners.has(event)) return;
    const listeners = [...this._listeners.get(event)];
    for (const { callback, context } of listeners) {
      callback.call(context, data);
    }
  }

  clear(event) {
    if (event) {
      this._listeners.delete(event);
    } else {
      this._listeners.clear();
    }
  }
}

export const eventBus = new EventBus();

// Catálogo de eventos del sistema — fuente única de verdad
export const Events = Object.freeze({
  // Engine
  ENGINE_READY:         'engine:ready',
  ENGINE_TICK:          'engine:tick',
  ENGINE_RESIZE:        'engine:resize',

  // Scene
  SCENE_CHANGE:         'scene:change',
  SCENE_TRANSITION_IN:  'scene:transition:in',
  SCENE_TRANSITION_OUT: 'scene:transition:out',

  // Scroll
  SCROLL_PROGRESS:      'scroll:progress',
  SCROLL_SECTION:       'scroll:section',

  // Server entity
  SERVER_AWAKEN:        'server:awaken',
  SERVER_PULSE:         'server:pulse',
  SERVER_CORRUPTED:     'server:corrupted',
  SERVER_RECOVERED:     'server:recovered',
  SERVER_TRUST:         'server:trust',

  // Narrative
  NARRATIVE_LINE:       'narrative:line',
  NARRATIVE_CHOICE:     'narrative:choice',
  NARRATIVE_EVENT:      'narrative:event',

  // UI
  UI_CURSOR_ENTER:      'ui:cursor:enter',
  UI_CURSOR_LEAVE:      'ui:cursor:leave',

  // Input
  INPUT_CLICK:          'input:click',
  INPUT_MOVE:           'input:move',
});
