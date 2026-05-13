/**
 * main.js — punto de entrada de AWAKENING PROTOCOL.
 * Bootstrapping: loading screen → engine → sistemas → primera escena.
 */

import { Engine }           from './core/Engine.js';
import { eventBus, Events } from './core/EventBus.js';
import { stateManager }     from './core/StateManager.js';
import { ScrollSystem }     from './systems/ScrollSystem.js';
import { NarrativeSystem }  from './systems/NarrativeSystem.js';
import { HUD }              from './ui/HUD.js';
import { TerminalUI }       from './ui/TerminalUI.js';
import { BootScene }        from './scenes/BootScene.js';
import { RuinsScene }       from './scenes/RuinsScene.js';
import { ServerScene }      from './scenes/ServerScene.js';

// ─── Loading screen helpers ─────────────────────────────────────────────────

const loadingScreen = document.getElementById('loading-screen');
const loadingBar    = document.getElementById('loading-bar');
const loadingText   = document.getElementById('loading-text');

function setLoadingProgress(pct, text) {
  loadingBar.style.width = `${pct}%`;
  if (text) loadingText.textContent = text;
}

async function hideLoadingScreen() {
  return new Promise(resolve => {
    loadingScreen.style.transition = 'opacity 0.8s ease';
    loadingScreen.style.opacity    = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      resolve();
    }, 850);
  });
}

// ─── Bootstrap ──────────────────────────────────────────────────────────────

async function bootstrap() {
  setLoadingProgress(10, 'INITIALIZING RENDER ENGINE...');
  await tick();

  // 1. Motor Three.js + post-processing
  const canvas = document.getElementById('webgl-canvas');
  const engine = new Engine(canvas);

  setLoadingProgress(35, 'LOADING SCENE REGISTRY...');
  await tick();

  // 2. Registrar escenas
  engine.sceneManager.register('boot',   BootScene);
  engine.sceneManager.register('ruins',  RuinsScene);
  engine.sceneManager.register('server', ServerScene);

  setLoadingProgress(55, 'MOUNTING UI SYSTEMS...');
  await tick();

  // 3. UI y sistemas narrativos
  const narrative = new NarrativeSystem();
  const hud       = new HUD();
  const terminal  = new TerminalUI(narrative);

  setLoadingProgress(70, 'INITIALIZING SCROLL ENGINE...');
  await tick();

  // 4. Sistema de scroll — 3000px, más corto y accesible
  const scrollContainer = document.getElementById('scroll-container');
  const scrollSystem    = new ScrollSystem(scrollContainer, 3000);
  scrollSystem.defineSections([
    { name: 'ruins',       start: 0.00, end: 0.60 },
    { name: 'server_core', start: 0.60, end: 1.00 },
  ]);

  // Transición al servidor al 60% del scroll
  eventBus.on(Events.SCROLL_SECTION, ({ name }) => {
    if (name === 'server_core') {
      const current = engine.sceneManager._current;
      if (current?.name !== 'server') engine.sceneManager.switchTo('server');
    }
  });

  // Indicador de scroll visible
  _buildScrollHint();

  setLoadingProgress(90, 'WARMING UP NEURAL PATHWAYS...');
  await tick();

  // 5. Arrancar motor de render
  engine.start();

  setLoadingProgress(100, 'SYSTEMS ONLINE.');
  await tick(300);

  // 6. Ocultar loading y empezar
  await hideLoadingScreen();
  await engine.sceneManager.switchTo('boot');

  // Exponer engine en dev para debugging
  if (import.meta.env.DEV) {
    window.__engine        = engine;
    window.__stateManager  = stateManager;
    window.__eventBus      = eventBus;
    window.__narrative     = narrative;
    console.log('%c NEXUS-7 AWAKENING PROTOCOL', 'color:#00ffcc; font-size:14px; font-weight:bold;');
    console.log('%c Dev tools: window.__engine, __stateManager, __eventBus', 'color:#888');
  }
}

// Indicador visual de scroll con flecha animada
function _buildScrollHint() {
  const hint = document.createElement('div');
  hint.id = 'scroll-hint';
  hint.innerHTML = `
    <div style="font-size:0.55rem;letter-spacing:0.25em;margin-bottom:8px;color:rgba(0,255,204,0.5)">SCROLL</div>
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
      <line x1="10" y1="0" x2="10" y2="20" stroke="rgba(0,255,204,0.5)" stroke-width="1"/>
      <polyline points="4,14 10,22 16,14" stroke="rgba(0,255,204,0.5)" stroke-width="1" fill="none"/>
    </svg>
  `;
  Object.assign(hint.style, {
    position:    'fixed',
    bottom:      '32px',
    right:       '32px',
    display:     'flex',
    flexDirection:'column',
    alignItems:  'center',
    fontFamily:  'var(--font-mono)',
    animation:   'scrollBounce 1.8s ease-in-out infinite',
    opacity:     '0',
    transition:  'opacity 1s',
    zIndex:      '20',
    pointerEvents:'none',
  });
  document.body.appendChild(hint);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes scrollBounce {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(8px); }
    }
  `;
  document.head.appendChild(style);

  // Mostrar 2s después del boot y ocultar al llegar al 60%
  setTimeout(() => { hint.style.opacity = '1'; }, 10000);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (3000 - window.innerHeight);
    if (pct > 0.55) hint.style.opacity = '0';
    else if (pct > 0.05) hint.style.opacity = '1';
  }, { passive: true });
}

// RAF-based tick para dar tiempo al navegador a pintar
function tick(ms = 16) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Entry point ────────────────────────────────────────────────────────────

bootstrap().catch(err => {
  console.error('FATAL: Bootstrap failed:', err);
  loadingText.textContent = `CRITICAL ERROR: ${err.message}`;
  loadingText.style.color = '#ff4444';
});
