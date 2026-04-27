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

  // Velocidad de parallax única, sutil. Misma para todas las imágenes.
  const PARALLAX_SPEED = 0.14;

  /* ---------- Render principal ---------- */
  function render() {
    const root = document.getElementById('chapters');
    if (!root || typeof STUDENTS === 'undefined' || typeof CHAPTERS === 'undefined') {
      console.warn('[Think About Ourselves] data.js no cargó correctamente.');
      return;
    }

    const frag = document.createDocumentFragment();

    CHAPTERS.forEach((chapter, chapterIdx) => {
      // Contenedor del capítulo: sólo el activo se renderiza (display:block)
      const wrapper = document.createElement('section');
      wrapper.className = 'chapter-section' + (chapterIdx === 0 ? ' is-active' : '');
      wrapper.dataset.chapterId = chapter.id;

      // ----- Header del capítulo (más compacto en modo tabs) -----
      const header = document.createElement('div');
      header.className = 'chapter-header';
      header.id = `chapter-${chapter.id}`;
      header.innerHTML = `
        <div class="chapter-header__inner">
          <span class="chapter-header__number reveal">Chapter ${String(chapter.number).padStart(2, '0')}</span>
          <h2 class="chapter-header__title reveal">${escapeHTML(chapter.title)}</h2>
          <p class="chapter-header__subtitle reveal">${escapeHTML(chapter.subtitle)}</p>
        </div>
      `;
      wrapper.appendChild(header);

      // ----- 4 secciones de estudiante en orden fijo -----
      STUDENTS.forEach((student) => {
        wrapper.appendChild(buildStudentSection(student, chapter));
      });

      frag.appendChild(wrapper);
    });

    root.appendChild(frag);
  }

  /* ---------- Navegación de capítulos por clic ---------- */
  function setupChapterNav() {
    const nav = document.getElementById('chapter-nav');
    if (!nav || typeof CHAPTERS === 'undefined') return;

    nav.innerHTML = CHAPTERS.map((c, i) => `
      <button type="button"
              class="chapter-nav__btn${i === 0 ? ' is-active' : ''}"
              data-chapter-id="${c.id}">
        <span class="chapter-nav__num">${String(c.number).padStart(2, '0')}</span>
        <span class="chapter-nav__title">${escapeHTML(c.title)}</span>
      </button>
    `).join('');

    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('.chapter-nav__btn');
      if (!btn) return;
      activateChapter(btn.dataset.chapterId);
    });
  }

  function activateChapter(id) {
    // Marca el botón activo en el nav
    $$('.chapter-nav__btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.chapterId === id);
    });
    // Muestra solo el capítulo elegido
    $$('.chapter-section').forEach((sec) => {
      const active = sec.dataset.chapterId === id;
      sec.classList.toggle('is-active', active);
      if (active) {
        // Forzamos los reveals del capítulo recién mostrado
        // (el IntersectionObserver no siempre dispara al cambiar display)
        $$('.reveal, .sentences', sec).forEach(el => el.classList.add('is-visible'));
      }
    });

    // Llevamos al usuario al inicio del capítulo. Usamos scrollTo en vez de
    // scrollIntoView porque éste último no scrollea cuando el target es un
    // elemento sticky que el navegador considera "ya visible" (pegado al tope).
    const navEl = document.getElementById('chapter-nav');
    if (!navEl) return;
    // offsetTop nos da la posición ORIGINAL del nav (justo después del hero).
    // Al hacer scroll a ese punto, el nav queda pegado arriba y el contenido
    // del capítulo activo aparece justo debajo.
    const targetY = navEl.offsetTop;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  function buildStudentSection(student, chapter) {
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

    const galleryHTML = sentences.map((text, i) => {
      const src = `images/${student.id}/${chapter.id}-${i + 1}.jpg`;
      const tag = `${String(i + 1).padStart(2, '0')} / 05`;
      // Si la oración es placeholder no la mostramos en el lightbox
      const sentenceForLightbox = isPlaceholder(text) ? '' : text;
      return `
        <figure class="media"
                data-parallax="${PARALLAX_SPEED}"
                data-sentence="${escapeHTML(sentenceForLightbox)}"
                data-student="${escapeHTML(student.name)}"
                data-chapter="${escapeHTML(chapter.title)}">
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

  /* ---------- Lightbox / Carrusel ---------- */
  function setupLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    const stage      = lb.querySelector('.lightbox__stage');
    const lbImg      = lb.querySelector('.lightbox__img');
    const lbCounter  = lb.querySelector('.lightbox__counter');
    const lbSentence = lb.querySelector('.lightbox__sentence');
    const lbMeta     = lb.querySelector('.lightbox__meta');
    const closeBtn   = lb.querySelector('.lightbox__close');
    const prevBtn    = lb.querySelector('.lightbox__nav--prev');
    const nextBtn    = lb.querySelector('.lightbox__nav--next');

    let items = [];
    let index = 0;
    let isOpen = false;
    let swapTimer = null;

    const pad = (n) => String(n).padStart(2, '0');

    const open = (galleryEl, startIndex) => {
      const figs = $$('.media', galleryEl);
      items = figs.map((fig) => ({
        src: fig.querySelector('img').getAttribute('src'),
        alt: fig.querySelector('img').getAttribute('alt'),
        sentence: fig.dataset.sentence || '',
        student:  fig.dataset.student  || '',
        chapter:  fig.dataset.chapter  || ''
      }));
      index = startIndex;
      isOpen = true;
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      show(false);
    };

    const close = () => {
      isOpen = false;
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      if (swapTimer) { clearTimeout(swapTimer); swapTimer = null; }
    };

    const show = (animate = true) => {
      const item = items[index];
      if (!item) return;

      // Actualiza texto inmediatamente
      lbCounter.textContent  = `${pad(index + 1)} / ${pad(items.length)}`;
      lbSentence.textContent = item.sentence;
      lbMeta.textContent     = item.student + (item.chapter ? ' · ' + item.chapter : '');

      const swap = () => {
        stage.classList.remove('is-missing');
        lbImg.onload  = () => lbImg.classList.remove('is-loading');
        lbImg.onerror = () => {
          stage.classList.add('is-missing');
          lbImg.classList.remove('is-loading');
        };
        lbImg.src = item.src;
        lbImg.alt = item.alt;
      };

      if (animate) {
        lbImg.classList.add('is-loading');
        if (swapTimer) clearTimeout(swapTimer);
        swapTimer = setTimeout(swap, 180);
      } else {
        swap();
      }
    };

    const next = () => { if (items.length) { index = (index + 1) % items.length; show(); } };
    const prev = () => { if (items.length) { index = (index - 1 + items.length) % items.length; show(); } };

    // Click en cualquier imagen → abre el lightbox en esa imagen
    const chapters = document.getElementById('chapters');
    if (chapters) {
      chapters.addEventListener('click', (e) => {
        const fig = e.target.closest('.media');
        if (!fig || fig.classList.contains('media--missing')) return;
        const gallery = fig.closest('.gallery');
        if (!gallery) return;
        const figs = $$('.media', gallery);
        const startIndex = figs.indexOf(fig);
        if (startIndex < 0) return;
        open(gallery, startIndex);
      });
    }

    closeBtn.addEventListener('click', close);
    prevBtn .addEventListener('click', prev);
    nextBtn .addEventListener('click', next);

    // Click en el fondo (no en la imagen ni botones)
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target === stage) close();
    });

    // Teclado: ← → Esc
    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if      (e.key === 'Escape')     close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft')  prev();
    });

    // Swipe en móvil
    let touchStartX = 0;
    lb.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    }, { passive: true });
  }

  /* ---------- Arranque ---------- */
  function init() {
    render();
    setupChapterNav();
    setupReveals();
    setupParallax();
    setupProgress();
    setupCursor();
    setupLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
