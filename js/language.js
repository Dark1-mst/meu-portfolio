/* ==========================================================================
   js/language.js — troca de idioma (PT / EN / ES / RU)
   O HTML traz o PT como padrão. Atributos reconhecidos:
     data-i18n="chave"                      troca o texto do elemento
     data-i18n-n="3"                        valor para {n} no texto
     data-i18n-attr="aria-label:chave;..."  troca atributos (alt, aria-label, placeholder)
   ========================================================================== */
(function () {
  'use strict';
  var P = window.Portfolio;
  var SUPPORTED = ['pt', 'en', 'es', 'ru'];
  var HTML_LANG = { pt: 'pt-BR', en: 'en', es: 'es', ru: 'ru' };

  var META = [
    ['#meta-description', 'content', 'meta.description'],
    ['#meta-og-title', 'content', 'meta.title'],
    ['#meta-og-description', 'content', 'meta.description'],
  ];

  function translateDom() {
    P.$$('[data-i18n]').forEach(function (el) {
      var text = P.t(el.getAttribute('data-i18n'), { n: el.getAttribute('data-i18n-n') });
      if (text) el.textContent = text;
    });
    P.$$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        var text = P.t(parts[1]);
        if (parts[0] && text) el.setAttribute(parts[0], text);
      });
    });
    var title = P.t('meta.title');
    if (title) document.title = title;
    META.forEach(function (m) {
      var el = P.$(m[0]);
      var text = P.t(m[2]);
      if (el && text) el.setAttribute(m[1], text);
    });
  }

  /* Links que abrem em nova aba avisam leitores de tela (texto traduzido) */
  function markNewTabLinks() {
    P.$$('a[target="_blank"]').forEach(function (a) {
      var hint = a.querySelector('.sr-only[data-new-tab]');
      if (!hint) {
        hint = document.createElement('span');
        hint.className = 'sr-only';
        hint.setAttribute('data-new-tab', '');
        a.appendChild(hint);
      }
      hint.textContent = ' ' + P.t('a11y.newTab');
    });
  }

  function apply(lang, initial) {
    if (SUPPORTED.indexOf(lang) === -1) lang = 'pt';
    P.lang = lang;
    document.documentElement.setAttribute('lang', HTML_LANG[lang]);
    var select = P.$('#lang-select');
    if (select && select.value !== lang) select.value = lang;
    // O HTML já está em PT: na primeira carga em PT não há nada a reescrever.
    if (!(initial && lang === 'pt')) translateDom();
    markNewTabLinks();
    P.store.set('lang', lang);
    P.emit('portfolio:language', { lang: lang });
  }

  P.setLanguage = function (lang) { apply(lang, false); };

  P.register('language', function () {
    var saved = P.store.get('lang');
    var browser = (navigator.language || 'pt').slice(0, 2).toLowerCase();
    var initial = SUPPORTED.indexOf(saved) !== -1 ? saved : (SUPPORTED.indexOf(browser) !== -1 ? browser : 'pt');

    var select = P.$('#lang-select');
    if (select) select.addEventListener('change', function () { apply(select.value, false); });

    apply(initial, true);
  });
})();
