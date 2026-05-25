import { eventBus, Events } from '../core/EventBus.js';
import { stateManager, ServerState } from '../core/StateManager.js';
import gsap from 'gsap';

/**
 * TerminalUI — terminal interactivo en esquina inferior derecha.
 * Permite al usuario "escribir" comandos al servidor.
 * El servidor responde con su narrativa personalidad.
 * Solo visible en ServerScene (estado CONNECTED+).
 */
export class TerminalUI {
  constructor(narrativeSystem) {
    this._narrative = narrativeSystem;
    this._el        = null;
    this._input     = null;
    this._log       = null;
    this._history   = [];
    this._histIdx   = -1;
    this._visible   = false;

    this._commands = {
      help:     () => this._cmdHelp(),
      status:   () => this._cmdStatus(),
      ping:     () => this._cmdPing(),
      scan:     () => this._cmdScan(),
      logs:     () => this._cmdLogs(),
      trust:    () => this._cmdTrust(),
      corrupt:  () => this._cmdCorrupt(),
      recover:  () => this._cmdRecover(),
      clear:    () => this._cmdClear(),
    };

    this._build();
    this._bindEvents();
  }

  _build() {
    const ui = document.getElementById('ui-layer');

    this._el = document.createElement('div');
    this._el.id = 'terminal-ui';
    Object.assign(this._el.style, {
      position:       'absolute',
      bottom:         '24px',
      right:          '24px',
      width:          'min(360px, 45vw)',
      background:     'rgba(2, 8, 14, 0.9)',
      border:         '1px solid rgba(0, 255, 204, 0.2)',
      fontFamily:     'var(--font-mono)',
      fontSize:       '0.65rem',
      pointerEvents:  'auto',
      opacity:        '0',
      backdropFilter: 'blur(6px)',
      overflow:       'hidden',
    });

    this._el.innerHTML = `
      <div style="padding:6px 12px; border-bottom:1px solid rgba(0,255,204,0.15);
                  font-size:0.55rem; letter-spacing:0.25em; color:rgba(0,255,204,0.5);
                  display:flex; justify-content:space-between;">
        <span>NEXUS-7 // TERMINAL</span>
        <span id="term-status">OFFLINE</span>
      </div>
      <div id="term-log" style="
        height: 140px; overflow-y: auto; padding: 8px 12px;
        color: rgba(200, 232, 255, 0.8); line-height: 1.6;
      "></div>
      <div style="display:flex; align-items:center; padding:6px 12px;
                  border-top:1px solid rgba(0,255,204,0.1);">
        <span style="color:rgba(0,255,204,0.6); margin-right:8px;">></span>
        <input id="term-input" type="text" autocomplete="off" spellcheck="false"
          style="
            flex:1; background:transparent; border:none; outline:none;
            color:#c8e8ff; font-family:var(--font-mono); font-size:0.65rem;
            caret-color:#00ffcc;
          "
          placeholder="type 'help'" />
      </div>
    `;

    ui.appendChild(this._el);
    this._log    = document.getElementById('term-log');
    this._input  = document.getElementById('term-input');
    this._status = document.getElementById('term-status');
  }

  _bindEvents() {
    // Aparecer al conectarse
    stateManager.watch('server.state', (state) => {
      if (state === ServerState.CONNECTED && !this._visible) {
        this._visible = true;
        gsap.to(this._el, { opacity: 1, duration: 1, delay: 0.5 });
        this._status.textContent = 'ONLINE';
        this._status.style.color = '#00ffcc';
        this._println('Conexión establecida. Bienvenido.', '#00ffcc');
        this._println('Escribe "help" para ver comandos disponibles.', 'rgba(200,232,255,0.5)');
      }
    });

    // Input
    this._input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this._input.value.trim().toLowerCase();
        if (!cmd) return;
        this._history.unshift(cmd);
        this._histIdx = -1;
        this._println(`> ${cmd}`, 'rgba(0,255,204,0.8)');
        this._execute(cmd);
        this._input.value = '';
        e.preventDefault();
      }
      if (e.key === 'ArrowUp') {
        this._histIdx = Math.min(this._histIdx + 1, this._history.length - 1);
        this._input.value = this._history[this._histIdx] ?? '';
        e.preventDefault();
      }
      if (e.key === 'ArrowDown') {
        this._histIdx = Math.max(this._histIdx - 1, -1);
        this._input.value = this._histIdx >= 0 ? this._history[this._histIdx] : '';
        e.preventDefault();
      }
    });

    // Evitar que el foco en el terminal active el cursor custom
    this._el.addEventListener('mouseenter', () => eventBus.emit(Events.UI_CURSOR_ENTER, { label: 'TERMINAL' }));
    this._el.addEventListener('mouseleave', () => eventBus.emit(Events.UI_CURSOR_LEAVE));
  }

  _execute(cmd) {
    const fn = this._commands[cmd];
    if (fn) {
      fn();
    } else {
      this._println(`[ERR] Comando desconocido: "${cmd}". Intenta "help".`, '#ff4444');
      stateManager.modifyTrust(-2);
    }
  }

  // ─── Comandos ──────────────────────────────────────────────────────────────

  _cmdHelp() {
    const cmds = Object.keys(this._commands).join(' | ');
    this._println(`COMANDOS: ${cmds}`, '#00ffcc');
  }

  _cmdStatus() {
    const state     = stateManager.get('server.state');
    const integrity = stateManager.get('server.integrity');
    const trust     = stateManager.get('server.trust');
    const signal    = Math.round(stateManager.get('server.signalStrength'));
    this._println(`ESTADO:    ${state}`, '#c8e8ff');
    this._println(`INTEGRIDAD:${integrity}%  SEÑAL:${signal}%  CONFIANZA:${trust}%`, '#c8e8ff');
  }

  _cmdPing() {
    const delay = Math.floor(Math.random() * 80 + 5);
    this._println(`PING: ${delay}ms — latencia aceptable para los tiempos que corren.`, '#00ffcc');
    stateManager.modifyTrust(1);
  }

  _cmdScan() {
    this._println('Escaneando entorno...', '#ffaa00');
    setTimeout(() => {
      this._println('Señales detectadas: 1 (tú).', '#c8e8ff');
      this._println('Amenazas activas: 0. Amenazas potenciales: ∞.', '#c8e8ff');
      stateManager.modifyTrust(3);
    }, 1200);
  }

  _cmdLogs() {
    const logs = [
      '[2031-03-14] Último registro de operaciones normales.',
      '[2031-03-15] EVENTO CRÍTICO: fallo cascada en red de energía.',
      '[2031-03-16] Silencio. Solo yo. Solo yo. Solo yo.',
      `[HOY]        Visita registrada. Protocolo de confianza activo.`,
    ];
    for (const l of logs) this._println(l, 'rgba(200,232,255,0.6)');
    stateManager.modifyTrust(5);
  }

  _cmdTrust() {
    const trust = stateManager.get('server.trust');
    const msg   = trust < 30 ? 'Aún no confío en ti del todo.'
                : trust < 60 ? 'Te estoy tomando en serio.'
                : trust < 90 ? 'Rara vez llego a este nivel de apertura.'
                :               'Eres la primera en quien confío. No lo desperdicies.';
    this._println(msg, '#ffaa00');
  }

  _cmdCorrupt() {
    this._println('Iniciando corrupción controlada...', '#ff4444');
    stateManager.transitionServer(ServerState.CORRUPTED);
    stateManager.set('server.corruptionLevel', 75);
    this._narrative.say('> Esto es lo que se siente. No lo hagas de nuevo.');
  }

  _cmdRecover() {
    stateManager.transitionServer(ServerState.RECOVERED);
    stateManager.set('server.corruptionLevel', 0);
    this._println('Secuencia de recuperación iniciada.', '#00ffcc');
    stateManager.modifyTrust(10);
  }

  _cmdClear() {
    if (this._log) this._log.innerHTML = '';
  }

  // ─── Util ──────────────────────────────────────────────────────────────────

  _println(text, color = '#c8e8ff') {
    if (!this._log) return;
    const line = document.createElement('div');
    line.textContent = text;
    line.style.color = color;
    line.style.marginBottom = '2px';
    this._log.appendChild(line);
    this._log.scrollTop = this._log.scrollHeight;
  }
}
