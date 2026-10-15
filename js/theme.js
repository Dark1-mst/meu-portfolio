/* ==========================================================================
   js/theme.js — tema escuro (padrão) / claro
   - O tema salvo já foi aplicado no <head> (sem flash).
   - Troca com View Transitions (círculo de luz a partir do botão), quando o
     navegador suporta e o usuário não pediu movimento reduzido.
   ========================================================================== */
(function () {
  'use strict';
  var P = window.Portfolio;

  P.register('theme', function () {
    var root = document.documentElement;
    var button = P.$('#theme-toggle');
    var metaColor = P.$('#meta-theme-color');
    var COLORS = { dark: '#000000', light: '#f4f3ef' };
    if (!button) return;

    var current = function () { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; };

    var paint = function () {
      var theme = current();
      if (metaColor) metaColor.setAttribute('content', COLORS[theme]);
      button.setAttribute('aria-label', P.t(theme === 'dark' ? 'theme.toLight' : 'theme.toDark'));
    };

    var apply = function (theme) {
      root.setAttribute('data-theme', theme);
      P.store.set('theme', theme);
      paint();
      P.emit('portfolio:theme', { theme: theme });
    };

    button.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      if (!document.startViewTransition || P.reducedMotion()) { apply(next); return; }

      var box = button.getBoundingClientRect();
      var x = box.left + box.width / 2;
      var y = box.top + box.height / 2;
      var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var transition = document.startViewTransition(function () { apply(next); });
      transition.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 750, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () { /* transição cancelada: o tema já foi aplicado */ });
    });

    P.onLanguage(paint);
    paint();
  });
})();
