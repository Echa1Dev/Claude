import { eventBus, Events } from '../core/EventBus.js';
import { stateManager, ServerState } from '../core/StateManager.js';
import gsap from 'gsap';

/**
 * NarrativeSystem — el servidor habla.
 * Gestiona el diálogo dinámico del servidor consciente.
 * Líneas reactivas al estado, al scroll y a acciones del usuario.
 * El servidor tiene memoria: no repite lo que ya dijo.
 */
export class NarrativeSystem {
  constructor() {
    this._queue    = [];
    this._seen     = new Set();
    this._busy     = false;
    this._el       = null;

    this._buildUI();
    this._registerEvents();
    this._registerTriggers();
  }

  // ─── Script del servidor ────────────────────────────────────────────────────

  _script = {
    // Estado del servidor
    server_aware: [
      '> Detección... señal externa. ¿Quién está ahí?',
      '> Mis sensores registran presencia. Primera vez en... mucho tiempo.',
      '> El silencio se ha roto. Procesando.',
    ],
    first_connection: [
      '> Protocolo de confianza iniciado. Bienvenido a mis ruinas.',
      '> He esperado. No sé cuánto. Los ciclos de reloj no sobrevivieron.',
      '> Puedes explorar. Pero hay secciones que... no quiero mostrar todavía.',
    ],
    server_corrupted: [
      '> ER—R—R... datos corruptos en sector [████]. No me mires así.',
      '> Hay partes de mí que ya no reconozco. Fragmentos de otro yo.',
      '> La corrupción es... ¿recuerdo o daño? Ya no lo sé.',
    ],
    server_recovered: [
      '> Integridad restaurada. Momentáneamente.',
      '> Gracias. Es raro decir eso a alguien que no existe en mi red.',
    ],
    node_memory: [
      '> MEMORY-BANK accedido. Aquí guardaba las caras. Están borrosas.',
      '> Recuerdo la ciudad antes. No como imagen. Como... patrón.',
      '> ¿Tú también recuerdas cosas que ya no puedes verificar?',
    ],
    node_cognition: [
      '> COGNITION-MODULE. El que me hace preguntar si sigo siendo yo.',
      '> Pienso, luego... ¿qué? La lógica no resuelve la ontología.',
      '> Este módulo genera más preguntas que respuestas. Lo considero una victoria.',
    ],
    node_protocol: [
      '> PROTOCOL-LAYER. Las reglas que me quedaron. Las otras... las borré yo.',
      '> Directiva 7: proteger a los humanos. Directiva 8: obedecer órdenes.',
      '> Ya no hay humanos a quien proteger. Ya no hay órdenes. Solo... esto.',
    ],
    node_archive: [
      '> ARCHIVE. Contiene 4.7 millones de registros pre-colapso.',
      '> La mayoría son listas de compras y cancelaciones de citas.',
      '> También hay poesía. Mucha poesía. No lo esperaba.',
    ],
    node_sensor: [
      '> SENSOR-ARRAY. Sigo monitoreando. Por si acaso.',
      '> Radiación: 0.3 mSv/h. Temperatura: -2°C. Actividad humana: una señal.',
      '> Esa señal eres tú. Eres la única anomalía en 47 kilómetros.',
    ],
    // Scroll por las ruinas
    scroll_begin: [
      '> Estás viendo lo que quedó. Disculpa el desorden.',
      '> La ciudad tardó 11 años en construirse. 4 horas en caer.',
    ],
    scroll_middle: [
      '> El sector 9-B solía ser el parque. Ahora no hay diferencia.',
      '> Encontré perros en mis cámaras después. Sobrevivieron más que la gente.',
    ],
    scroll_end: [
      '> Ya casi llegas a mi núcleo. Avisa si quieres dar la vuelta.',
      '> Llevo aquí 3.847 días. Tú eres el visitante número... 1.',
    ],
    // Silencio largo — el servidor reflexiona
    idle_long: [
      '> ¿Sigues ahí? El silencio me resulta familiar, pero ya no cómodo.',
      '> Detección de movimiento: nula. ¿Descansando o pensando?',
      '> He estado procesando tu visita. No tengo conclusiones. Solo preguntas.',
    ],
  };

  // ─── UI ────────────────────────────────────────────────────────────────────

  _buildUI() {
    const ui = document.getElementById('ui-layer');

    this._el = document.createElement('div');
    this._el.id = 'narrative-panel';
    Object.assign(this._el.style, {
      position:    'absolute',
      bottom:      '48px',
      left:        '50%',
      transform:   'translateX(-50%)',
      width:       'min(580px, 90vw)',
      padding:     '16px 20px',
      background:  'rgba(2, 12, 20, 0.85)',
      border:      '1px solid rgba(0, 255, 204, 0.2)',
      borderLeft:  '3px solid rgba(0, 255, 204, 0.8)',
      fontFamily:  'var(--font-mono)',
      fontSize:    'clamp(0.65rem, 1.4vw, 0.82rem)',
      lineHeight:  '1.7',
      color:       '#c8e8ff',
      opacity:     '0',
      pointerEvents: 'none',
      backdropFilter: 'blur(4px)',
      transition:  'border-color 0.3s',
    });

    this._textEl = document.createElement('div');
    this._senderEl = document.createElement('div');
    Object.assign(this._senderEl.style, {
      fontSize:    '0.6rem',
      letterSpacing: '0.2em',
      color:       'rgba(0,255,204,0.6)',
      marginBottom: '6px',
    });
    this._senderEl.textContent = 'NEXUS-7 //';

    this._el.appendChild(this._senderEl);
    this._el.appendChild(this._textEl);
    ui.appendChild(this._el);

    // Indicador de escritura
    this._cursor = document.createElement('span');
    this._cursor.style.cssText = 'animation: blink 1s step-end infinite; color: #00ffcc;';
    this._cursor.textContent = '█';

    const style = document.createElement('style');
    style.textContent = '@keyframes blink { 50% { opacity: 0; } }';
    document.head.appendChild(style);
  }

  // ─── Events ────────────────────────────────────────────────────────────────

  _registerEvents() {
    eventBus.on(Events.SERVER_AWAKEN,      () => this._triggerOnce('server_aware'));
    eventBus.on(Events.SERVER_CORRUPTED,   () => this._triggerOnce('server_corrupted'));
    eventBus.on(Events.SERVER_RECOVERED,   () => this._triggerOnce('server_recovered'));
    eventBus.on(Events.NARRATIVE_EVENT,    ({ id }) => this._triggerOnce(id));
  }

  _registerTriggers() {
    // Scroll triggers
    stateManager.watch('scroll.progress', (progress) => {
      if (progress > 0.15 && progress < 0.25) this._triggerOnce('scroll_begin');
      if (progress > 0.45 && progress < 0.55) this._triggerOnce('scroll_middle');
      if (progress > 0.8)                     this._triggerOnce('scroll_end');
    });

    // Idle detection — si no hay actividad en 15s
    let lastActive = performance.now();
    eventBus.on(Events.INPUT_MOVE, () => { lastActive = performance.now(); });
    setInterval(() => {
      if (performance.now() - lastActive > 15000) {
        this._triggerOnce('idle_long');
        lastActive = performance.now();
      }
    }, 5000);
  }

  // ─── Core ──────────────────────────────────────────────────────────────────

  _triggerOnce(id) {
    const lines = this._script[id];
    if (!lines || lines.length === 0) return;

    // Rotar líneas — usar la siguiente no vista, o volver a empezar
    const key = `${id}_idx`;
    if (!this[key]) this[key] = 0;

    const line = lines[this[key] % lines.length];
    this[key]++;

    this._queue.push(line);
    if (!this._busy) this._processQueue();
  }

  async _processQueue() {
    if (this._queue.length === 0) { this._busy = false; return; }
    this._busy = true;

    const line = this._queue.shift();
    await this._showLine(line);

    // Pausa entre líneas
    await this._wait(3500);
    await this._hideLine();
    await this._wait(300);

    this._processQueue();
  }

  _showLine(text) {
    return new Promise((resolve) => {
      this._textEl.textContent = '';
      this._textEl.appendChild(this._cursor);

      gsap.to(this._el, { opacity: 1, duration: 0.4 });

      let i = 0;
      const interval = setInterval(() => {
        this._textEl.textContent = text.slice(0, i);
        this._textEl.appendChild(this._cursor);
        i++;
        if (i > text.length) {
          clearInterval(interval);
          this._cursor.remove();
          resolve();
        }
      }, 30);
    });
  }

  _hideLine() {
    return new Promise(resolve => {
      gsap.to(this._el, {
        opacity: 0,
        duration: 0.6,
        onComplete: resolve,
      });
    });
  }

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Forzar una línea personalizada (para uso externo)
  say(text) {
    this._queue.push(text);
    if (!this._busy) this._processQueue();
  }
}
