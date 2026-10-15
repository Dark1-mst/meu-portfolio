/* js/main.js — inicia todos os módulos registrados (ordem dos <script>) */
(function () {
  'use strict';
  var P = window.Portfolio;
  P.register('footer', function () {
    var year = P.$('#year');
    if (year) year.textContent = String(new Date().getFullYear());
  });
  P.start();
})();
