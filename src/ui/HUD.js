import { eventBus, Events } from '../core/EventBus.js';
import { stateManager, ServerState } from '../core/StateManager.js';
import gsap from 'gsap';

/**
 * HUD — interfaz de usuario persistente.
 * Muestra el estado del servidor en tiempo real: integridad, señal, confianza.
 * Diseño: esquina superior izquierda, estilo terminal militar.
 */
export class HUD {
  constructor() {
    this._el = null;
    this._bars = {};
    this._stateLabel = null;
    this._uptimeEl = null;
    this._nodeLabel = null;
    this._build();
    this._bindEvents();
  }

  _build() {
    const ui = document.getElementById('ui-layer');

    this._el = document.createElement('div');
    this._el.id = 'hud';
    Object.assign(this._el.style, {
      position: 'absolute',
      top: '24px',
      left: '24px',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.65rem',
      letterSpacing: '0.08em',
      lineHeight: '1.6',
      color: 'rgba(0, 255, 204, 0.7)',
      pointerEvents: 'none',
      opacity: '0',
    });

    this._el.innerHTML = `
      <div style="margin-bottom:6px; font-size:0.55rem; letter-spacing:0.3em; color:rgba(0,255,204,0.4)">
        NEXUS-7 // SYSTEM STATUS
      </div>
      <div class="hud-row" id="hud-state">STATE: <span id="hud-state-val">DORMANT</span></div>
      <div class="hud-row" style="margin-top:8px;">
        <div>INTEGRITY</div>
        <div class="hud-bar-wrap"><div class="hud-bar" id="bar-integrity" style="background:#00ffcc"></div></div>
      </div>
      <div class="hud-row">
        <div>SIGNAL</div>
        <div class="hud-bar-wrap"><div class="hud-bar" id="bar-signal" style="background:#0088ff"></div></div>
      </div>
      <div class="hud-row">
        <div>TRUST</div>
        <div class="hud-bar-wrap"><div class="hud-bar" id="bar-trust" style="background:#ffaa00"></div></div>
      </div>
      <div class="hud-row" style="margin-top:8px; color:rgba(0,255,204,0.4)">
        UPTIME: <span id="hud-uptime">00:00:00</span>
      </div>
      <div id="hud-node-label" style="margin-top:10px; opacity:0; color:#ffaa00; font-size:0.6rem; letter-spacing:0.2em;"></div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .hud-row { display: flex; gap: 8px; align-items: center; margin-bottom: 2px; }
      .hud-bar-wrap {
        flex: 1; height: 2px; background: rgba(0,255,204,0.1);
        border: 1px solid rgba(0,255,204,0.15);
        max-width: 120px;
      }
      .hud-bar { height: 100%; width: 0%; transition: width 0.5s ease; }
    `;
    document.head.appendChild(style);

    ui.appendChild(this._el);

    this._bars.integrity = document.getElementById('bar-integrity');
    this._bars.signal    = document.getElementById('bar-signal');
    this._bars.trust     = document.getElementById('bar-trust');
    this._stateLabel     = document.getElementById('hud-state-val');
    this._uptimeEl       = document.getElementById('hud-uptime');
    this._nodeLabel      = document.getElementById('hud-node-label');
  }

  _bindEvents() {
    // Mostrar HUD cuando el servidor arranca
    eventBus.on(Events.SERVER_AWAKEN, () => {
      gsap.to(this._el, { opacity: 1, duration: 1.5, delay: 0.5 });
    });

    // Actualizar barras al cambiar estado
    stateManager.watch('server.integrity', v => this._setBar('integrity', v));
    stateManager.watch('server.signalStrength', v => this._setBar('signal', v));
    stateManager.watch('server.trust', v => this._setBar('trust', v));
    stateManager.watch('server.state', v => this._setState(v));
    stateManager.watch('server.uptime', v => this._setUptime(v));

    // Etiqueta de nodo al hover
    eventBus.on(Events.UI_CURSOR_ENTER, ({ label }) => {
      this._nodeLabel.textContent = `[ ${label} ]`;
      gsap.to(this._nodeLabel, { opacity: 1, duration: 0.2 });
    });
    eventBus.on(Events.UI_CURSOR_LEAVE, () => {
      gsap.to(this._nodeLabel, { opacity: 0, duration: 0.3 });
    });
  }

  _setBar(name, value) {
    const el = this._bars[name];
    if (el) el.style.width = `${Math.max(0, Math.min(100, value))}%`;
  }

  _setState(state) {
    if (!this._stateLabel) return;
    this._stateLabel.textContent = state;

    const colors = {
      [ServerState.DORMANT]:    '#444',
      [ServerState.BOOTING]:    '#ffaa00',
      [ServerState.AWARE]:      '#00ffcc',
      [ServerState.CONNECTED]:  '#00aaff',
      [ServerState.CORRUPTED]:  '#ff4444',
      [ServerState.RECOVERED]:  '#88ffaa',
    };
    this._stateLabel.style.color = colors[state] ?? '#c8e8ff';
    this._stateLabel.style.textShadow = `0 0 8px ${colors[state] ?? '#c8e8ff'}`;
  }

  _setUptime(seconds) {
    if (!this._uptimeEl) return;
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    this._uptimeEl.textContent = `${h}:${m}:${s}`;
  }
}
