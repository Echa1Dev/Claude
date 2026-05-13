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

  // 4. Sistema de scroll — 8000px de experiencia
  const scrollContainer = document.getElementById('scroll-container');
  const scrollSystem    = new ScrollSystem(scrollContainer, 8000);
  scrollSystem.defineSections([
    { name: 'boot',        start: 0.00, end: 0.15 },
    { name: 'ruins_enter', start: 0.15, end: 0.40 },
    { name: 'ruins_mid',   start: 0.40, end: 0.65 },
    { name: 'ruins_exit',  start: 0.65, end: 0.85 },
    { name: 'server_core', start: 0.85, end: 1.00 },
  ]);

  // Transición automática a ServerScene al llegar al final
  eventBus.on(Events.SCROLL_SECTION, ({ name }) => {
    if (name === 'server_core') {
      engine.sceneManager.switchTo('server');
    } else if (name === 'ruins_enter' || name === 'ruins_mid' || name === 'ruins_exit') {
      const current = engine.sceneManager._current;
      if (current?.name !== 'ruins') {
        engine.sceneManager.switchTo('ruins');
      }
    }
  });

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
