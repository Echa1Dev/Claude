/**
 * BaseScene — clase abstracta base para todas las escenas.
 * Define el contrato de ciclo de vida que cada escena debe implementar.
 */
export class BaseScene {
  constructor(engine, name) {
    this.engine = engine;
    this.name   = name;
    this._objects = [];   // Three.js objects a limpiar en destroy
    this._timers  = [];   // setTimeouts/setIntervals a limpiar
    this._unsubs  = [];   // Unsubscribers de EventBus
  }

  // Llamado una vez al entrar a la escena
  async init(data = {}) {}

  // Llamado cada frame
  update(dt) {}

  // Llamado al redimensionar ventana
  resize(width, height) {}

  // Llamado al abandonar la escena — limpieza obligatoria
  async destroy() {
    for (const obj of this._objects) {
      this.engine.removeFromScene(obj);
      obj.traverse((child) => {
        child.geometry?.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
    for (const unsub of this._unsubs) unsub();
    for (const timer of this._timers) clearTimeout(timer);
    this._objects = [];
    this._unsubs  = [];
    this._timers  = [];
  }

  // Helpers para registrar recursos y limpiarlos automáticamente
  _track(obj) {
    this._objects.push(obj);
    this.engine.addToScene(obj);
    return obj;
  }

  _listen(unsub) {
    this._unsubs.push(unsub);
    return unsub;
  }

  _delay(fn, ms) {
    const id = setTimeout(fn, ms);
    this._timers.push(id);
    return id;
  }
}
