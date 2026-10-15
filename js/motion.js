/* ==========================================================================
   js/motion.js — movimento do site
   1. Revelações por rolagem (uma vez por elemento) — só com movimento permitido.
   2. Luz que segue o ponteiro sobre a grade de pontos (só ponteiro "fino").
   3. Um vídeo por vez.
   O que é revelado está listado em REVEAL; o CSS (seção 13) esconde os mesmos
   seletores somente quando <html> tem a classe .js e o movimento é permitido.
   ========================================================================== */
(function () {
  'use strict';
  var P = window.Portfolio;

  var REVEAL = [
    '.reveal-title', '.section-lede', '.project', '.about-copy', '.portrait',
    '.tier', '.timeline', '.step', '.cert', '.chat', '.mail-cta', '.contact-form', '.contact-links',
  ].join(',');

  /* revelações */
  P.register('reveal', function () {
    var nodes = P.$$(REVEAL);
    // escalonamento: índice do elemento entre irmãos do mesmo tipo (--i)
    nodes.forEach(function (el) {
      var siblings = P.$$(':scope > ' + '.' + (el.classList[0] || ''), el.parentElement);
      var index = siblings.indexOf(el);
      el.style.setProperty('--i', Math.max(0, index));
    });
    if (P.reducedMotion() || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var pending = new Set(nodes);
    var reveal = function (el) { el.classList.add('is-in'); pending.delete(el); };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    nodes.forEach(function (el) { io.observe(el); });

    // Rolagem que "pula" seções (tecla End, âncoras, restauração de rolagem ao recarregar):
    // o que ficou ACIMA da tela nunca cruzaria o observador. Revela em silêncio.
    var sweep = P.frame(function () {
      var behind = [];
      pending.forEach(function (el) { if (el.getBoundingClientRect().bottom < 0) behind.push(el); });
      behind.forEach(function (el) { reveal(el); io.unobserve(el); });
    });
    addEventListener('scroll', sweep, { passive: true });
    sweep();
  });

  /* luz do ponteiro */
  P.register('pointer-light', function () {
    var layer = P.$('.backdrop');
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!layer || !fine.matches || P.reducedMotion()) return;

    var target = { x: innerWidth * 0.74, y: innerHeight * 0.16 };
    var now = { x: target.x, y: target.y };
    var running = false;

    var tick = function () {
      now.x += (target.x - now.x) * 0.12;
      now.y += (target.y - now.y) * 0.12;
      layer.style.setProperty('--lx', now.x.toFixed(1) + 'px');
      layer.style.setProperty('--ly', now.y.toFixed(1) + 'px');
      if (Math.abs(target.x - now.x) > 0.5 || Math.abs(target.y - now.y) > 0.5) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };
    addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
  });

  /* só um vídeo tocando por vez */
  P.register('videos', function () {
    var videos = P.$$('video');
    videos.forEach(function (video) {
      video.addEventListener('play', function () {
        videos.forEach(function (other) { if (other !== video && !other.paused) other.pause(); });
      });
    });
  });
})();
