import { eventBus, Events } from '../core/EventBus.js';
import { stateManager } from '../core/StateManager.js';

/**
 * ScrollSystem — conecta el scroll del DOM con el mundo 3D.
 * Genera secciones "virtuales" de la experiencia sin alterar el DOM.
 * Emite eventos de progreso y cambio de sección que los sistemas escuchan.
 */
export class ScrollSystem {
  constructor(scrollContainer, totalHeight = 5000) {
    this._container    = scrollContainer;
    this._totalHeight  = totalHeight;
    this._lastY        = 0;
    this._progress     = 0;
    this._velocity     = 0;
    this._sections     = [];
    this._currentSection = -1;

    this._setupDOM();
    this._bindScroll();
  }

  defineSections(sections) {
    // sections: [{ name, start, end }] donde start/end son 0–1
    this._sections = sections;
  }

  _setupDOM() {
    // El contenedor necesita altura para que el scroll funcione
    this._container.style.height = `${this._totalHeight}px`;

    // Spacer para el canvas fijo
    const spacer = document.createElement('div');
    spacer.style.height = '100vh';
    spacer.style.pointerEvents = 'none';
    this._container.appendChild(spacer);
  }

  _bindScroll() {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this._update();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Touch support
    let touchStartY = 0;
    window.addEventListener('touchstart', e => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchmove', e => {
      const dy = touchStartY - e.touches[0].clientY;
      window.scrollBy(0, dy * 0.5);
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  _update() {
    const scrollY   = window.scrollY;
    const maxScroll = this._totalHeight - window.innerHeight;
    const progress  = maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0;

    this._velocity = scrollY - this._lastY;
    this._lastY    = scrollY;
    this._progress = progress;

    stateManager.set('scroll.progress', progress);

    eventBus.emit(Events.SCROLL_PROGRESS, {
      progress,
      scrollY,
      velocity: this._velocity,
    });

    this._checkSections(progress);
  }

  _checkSections(progress) {
    for (let i = 0; i < this._sections.length; i++) {
      const { start, end } = this._sections[i];
      if (progress >= start && progress < end) {
        if (this._currentSection !== i) {
          this._currentSection = i;
          stateManager.set('scroll.sectionIndex', i);
          eventBus.emit(Events.SCROLL_SECTION, {
            index: i,
            name: this._sections[i].name,
          });
        }
        return;
      }
    }
  }

  // Scroll programático a una sección
  scrollToSection(index) {
    const section = this._sections[index];
    if (!section) return;
    const target = section.start * (this._totalHeight - window.innerHeight);
    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  get progress() { return this._progress; }
  get velocity() { return this._velocity; }
}
