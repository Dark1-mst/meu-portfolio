/* ==========================================================================
   js/nav.js — cabeçalho: menu mobile acessível, item ativo na rolagem,
   indicador deslizante e barra de progresso.
   ========================================================================== */
(function () {
  'use strict';
  var P = window.Portfolio;
  var DESKTOP = window.matchMedia('(min-width: 1100px)');

  P.register('nav', function () {
    var header = P.$('#site-header');
    var links = P.$('#nav-links');
    var toggle = P.$('#nav-toggle');
    var indicator = P.$('.nav-indicator');
    var bar = P.$('#progress-bar');
    var items = P.$$('.nav-link[data-section]');
    if (!header || !links) return;

    /* ---------- menu mobile (padrão "disclosure") ---------- */
    var isOpen = function () { return links.classList.contains('is-open'); };
    var label = function () {
      if (toggle) toggle.setAttribute('aria-label', P.t(isOpen() ? 'nav.menuClose' : 'nav.menuOpen'));
    };
    var setOpen = function (open, restoreFocus) {
      links.classList.toggle('is-open', open);
      if (toggle) toggle.setAttribute('aria-expanded', String(open));
      label();
      if (open) {
        var first = P.$('.nav-link', links);
        if (first && !DESKTOP.matches) first.focus({ preventScroll: true });
      } else if (restoreFocus && toggle) {
        toggle.focus();
      }
    };

    if (toggle) toggle.addEventListener('click', function () { setOpen(!isOpen(), false); });
    links.addEventListener('click', function (e) { if (e.target.closest('a') && isOpen()) setOpen(false, false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) setOpen(false, true); });
    document.addEventListener('click', function (e) { if (isOpen() && !header.contains(e.target)) setOpen(false, false); });
    DESKTOP.addEventListener('change', function () { if (DESKTOP.matches && isOpen()) setOpen(false, false); });
    P.onLanguage(function () { label(); moveIndicator(); });
    label();

    /* ---------- item ativo + indicador ---------- */
    var active = null;
    var moveIndicator = function () {
      if (!indicator) return;
      if (!active || !DESKTOP.matches) { indicator.classList.remove('is-on'); return; }
      indicator.style.setProperty('--x', active.offsetLeft + 'px');
      indicator.style.setProperty('--w', active.offsetWidth + 'px');
      indicator.classList.add('is-on');
    };
    var setActive = function (link) {
      if (link === active) return;
      active = link;
      items.forEach(function (a) {
        var on = a === link;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      moveIndicator();
    };

    var byId = {};
    items.forEach(function (a) { byId[a.getAttribute('data-section')] = a; });
    var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);

    if ('IntersectionObserver' in window) {
      var visible = {};
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
        var hit = sections.filter(function (s) { return visible[s.id]; }).pop();
        setActive(hit ? byId[hit.id] : null);
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { spy.observe(s); });
    }

    if ('ResizeObserver' in window) new ResizeObserver(P.frame(moveIndicator)).observe(links);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);

    /* ---------- cabeçalho e progresso (um único listener, 1 vez por quadro) ---------- */
    var onScroll = P.frame(function () {
      var max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
      header.classList.toggle('is-scrolled', scrollY > 24);
    });
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    onScroll();
  });
})();
