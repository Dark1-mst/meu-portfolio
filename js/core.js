/* ==========================================================================
   js/core.js — base compartilhada
   Scripts clássicos (sem ES modules) de propósito: o site continua abrindo com
   duplo clique em index.html (file://), sem build e sem servidor.
   Cada arquivo registra um módulo com Portfolio.register(nome, init);
   Portfolio.start() (js/main.js) inicializa todos, isolando falhas: se um módulo
   quebrar, os outros continuam funcionando.
   ========================================================================== */
(function () {
  'use strict';

  var P = (window.Portfolio = window.Portfolio || {});
  var modules = [];

  P.$ = function (selector, root) { return (root || document).querySelector(selector); };
  P.$$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };

  P.reducedMotion = function () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /* localStorage pode lançar erro (modo privado, política do navegador) */
  P.store = {
    get: function (key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set: function (key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignora */ } },
  };

  P.lang = 'pt';

  /* Tradução com fallback para PT e substituição de {variáveis} */
  P.t = function (key, vars) {
    var dict = window.I18N || {};
    var text = (dict[P.lang] && dict[P.lang][key]) || (dict.pt && dict.pt[key]) || '';
    if (vars) {
      text = text.replace(/\{(\w+)\}/g, function (match, name) {
        return vars[name] !== undefined ? vars[name] : match;
      });
    }
    return text;
  };

  P.emit = function (name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail }));
  };
  P.onLanguage = function (fn) {
    document.addEventListener('portfolio:language', function (e) { fn(e.detail.lang); });
  };

  /* Executa fn no máximo uma vez por quadro (scroll, resize, pointermove) */
  P.frame = function (fn) {
    var queued = false;
    return function () {
      if (queued) return;
      queued = true;
      var args = arguments;
      requestAnimationFrame(function () { queued = false; fn.apply(null, args); });
    };
  };

  /* Carrega um script sob demanda (funciona também em file://) */
  var loading = {};
  P.loadScript = function (src) {
    if (loading[src]) return loading[src];
    loading[src] = new Promise(function (resolve, reject) {
      var el = document.createElement('script');
      el.src = src;
      el.async = true;
      el.onload = resolve;
      el.onerror = function () { delete loading[src]; reject(new Error('Falha ao carregar ' + src)); };
      document.head.appendChild(el);
    });
    return loading[src];
  };

  P.register = function (name, init) { modules.push({ name: name, init: init }); };

  P.start = function () {
    modules.forEach(function (m) {
      try { m.init(); } catch (error) { console.error('[portfolio] módulo "' + m.name + '" falhou:', error); }
    });
  };
})();
