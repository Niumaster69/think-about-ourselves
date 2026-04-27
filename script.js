/* =========================================================
   script.js — Render, animaciones y parallax
   ---------------------------------------------------------
   Sin frameworks. Solo IntersectionObserver y rAF.
   Lee STUDENTS y CHAPTERS desde data.js.
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Utilidades ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const isMobile = () => window.matchMedia('(max-width: 640px)').matches;
  const isCoarse = () => window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Detecta si una oración es un placeholder pendiente de edición
  const isPlaceholder = (text) => /^\s*\[Sentence\s*\d+\]\s*$/i.test(text);

  // Patrones de layout para las galerías. Se rotan por capítulo y estudiante
  // para que cada bloque tenga un ritmo visual distinto sin verse aleatorio.
  const GALLERY_LAYOUTS = [
    ['feature', 'pair-l', 'pair-r', 'narrow-l', 'narrow-r'],
    ['narrow-l', 'narrow-r', 'feature', 'pair-l', 'pair-r'],
    ['right',    'pair-l', 'pair-r', 'left',    'feature'],
    ['feature', 'left',    'right',  'pair-l',  'pair-r']
  ];

  /* ---------- Render principal ---------- */
  function render() {
    const root = document.getElementById('chapters');
    if (!root || typeof STUDENTS === 'undefined' || typeof CHAPTERS === 'undefined') {
      console.warn('[Think About Ourselves] data.js no cargó correctamente.');
      return;
    }

    const frag = document.createDocumentFragment();

    CHAPTERS.forEach((chapter, chapterIdx) => {
      // ----- Header del capítulo (pantalla completa) -----
      const header = document.createElement('section');
      header.className = 'chapter-header';
      header.id = `chapter-${chapter.id}`;
      header.innerHTML = `
        <div class="chapter-header__inner">
          <span class="chapter-header__number reveal">Chapter ${String(chapter.number).padStart(2, '0')}</span>
          <h2 class="chapter-header__title reveal">${escapeHTML(chapter.title)}</h2>
          <p class="chapter-header__subtitle reveal">${escapeHTML(chapter.subtitle)}</p>
        </div>
      `;
      frag.appendChild(header);

      // ----- 4 secciones de estudiante en orden fijo -----
      STUDENTS.forEach((student, studentIdx) => {
        const layout = GALLERY_LAYOUTS[(chapterIdx + studentIdx) % GALLERY_LAYOUTS.length];
        const section = buildStudentSection(student, chapter, layout);
        frag.appendChild(section);
      });
    });

    root.appendChild(frag);
  }

  function buildStudentSection(student, chapter, layout) {
    const section = document.createElement('section');
    section.className = 'student';
    section.id = `${student.id}-${chapter.id}`;
    section.dataset.student = student.id;
    section.dataset.chapter = chapter.id;

    const sentences = student.chapters[chapter.id] || [];
    const sentencesHTML = sentences.map((text, i) => {
      const placeholder = isPlaceholder(text);
      const safe = escapeHTML(text);
      return `
        <li class="sentence${placeholder ? ' sentence--placeholder' : ''}">
          <span class="sentence__num">${String(i + 1).padStart(2, '0')}</span>
          <p class="sentence__text">${safe}</p>
        </li>
      `;
    }).join('');

    const galleryHTML = sentences.map((_, i) => {
      const cls = layout[i] || 'feature';
      const src = `images/${student.id}/${chapter.id}-${i + 1}.jpg`;
      const tag = `${String(i + 1).padStart(2, '0')} / 05`;
      // data-parallax controla la velocidad relativa (0 = sin parallax)
      const speed = parallaxSpeedFor(cls);
      return `
        <figure class="media media--${cls}" data-parallax="${speed}">
          <span class="media__tag">${tag}</span>
          <img
            src="${src}"
            alt="${escapeHTML(student.name)} — ${escapeHTML(chapter.title)} (${i + 1}/5)"
            loading="lazy"
            decoding="async">
        </figure>
      `;
    }).join('');

    section.innerHTML = `
      <div class="student__inner">
        <header class="student__head reveal">
          <h3 class="student__name">${escapeHTML(student.name)}</h3>
          <span class="student__tag">${escapeHTML(chapter.title)} · 05 lines</span>
        </header>
        <ol class="sentences reveal">${sentencesHTML}</ol>
        <div class="gallery">${galleryHTML}</div>
      </div>
    `;

    // Manejo de imágenes faltantes → placeholder elegante
    $$('img', section).forEach((img) => {
      img.addEventListener('error', () => handleMissingImage(img), { once: true });
    });

    return section;
  }

  function parallaxSpeedFor(layoutClass) {
    // Distintas velocidades por tipo de imagen → sensación de profundidad
    switch (layoutClass) {
      case 'feature':
      case 'wide':     return 0.18;
      case 'right':
      case 'left':     return 0.14;
      case 'narrow-l':
      case 'narrow-r': return 0.22;
      case 'pair-l':
      case 'pair-r':   return 0.10;
      default:         return 0.14;
    }
  }

  function handleMissingImage(img) {
    const fig = img.closest('.media');
    if (!fig) return;
    fig.classList.add('media--missing');
    // Inserta el cartel de "Photo coming soon"
    const ph = document.createElement('div');
    ph.className = 'media__placeholder';
    ph.innerHTML = `
      <span>Photo coming soon</span>
      <span>${img.getAttribute('src').split('/').pop()}</span>
    `;
    fig.appendChild(ph);
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  /* ---------- Reveals (fade-in al entrar al viewport) ---------- */
  function setupReveals() {
    const targets = $$('.reveal, .sentences');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    targets.forEach(el => io.observe(el));
  }

  /* ---------- Parallax sutil con rAF ---------- */
  function setupParallax() {
    if (prefersReducedMotion() || isMobile()) {
      // En móvil dejamos las imágenes estáticas (sin escala) para evitar lag
      $$('.media img').forEach(img => { img.style.transform = 'none'; });
      return;
    }

    const items = $$('[data-parallax]').map((el) => ({
      el,
      img: el.querySelector('img'),
      speed: parseFloat(el.dataset.parallax) || 0.15,
      visible: false
    }));

    if (!items.length) return;

    // Solo procesamos las imágenes visibles para no malgastar ciclos
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const item = items.find(i => i.el === entry.target);
        if (item) item.visible = entry.isIntersecting;
      });
    }, { rootMargin: '20% 0px 20% 0px' });
    items.forEach(i => io.observe(i.el));

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const vh = window.innerHeight;
        items.forEach((item) => {
          if (!item.visible || !item.img) return;
          const rect = item.el.getBoundingClientRect();
          // Progreso del elemento a través del viewport: -1 (abajo) → 1 (arriba)
          const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
          const offset = progress * item.speed * 100; // px
          item.img.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) scale(1.08)`;
        });
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Barra de progreso de scroll ---------- */
  function setupProgress() {
    const bar = $('.progress__bar');
    if (!bar) return;
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Cursor personalizado (solo desktop fino) ---------- */
  function setupCursor() {
    if (isCoarse() || prefersReducedMotion()) return;
    const ring = $('.cursor');
    const dot  = $('.cursor-dot');
    if (!ring || !dot) return;

    document.body.classList.add('cursor-ready');

    let rx = 0, ry = 0, dx = 0, dy = 0; // ring posiciones
    let tx = 0, ty = 0;                 // posición objetivo

    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      dx = tx; dy = ty;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };
    document.addEventListener('mousemove', onMove, { passive: true });

    const animate = () => {
      // Lerp suave para el aro exterior
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    // Modo "hover" sobre imágenes: cursor más grande
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.media')) document.body.classList.add('cursor-hover-image');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('.media')) document.body.classList.remove('cursor-hover-image');
    });
  }

  /* ---------- Arranque ---------- */
  function init() {
    render();
    setupReveals();
    setupParallax();
    setupProgress();
    setupCursor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
