/* ==========================================================================
   js/lightbox.js — visualizador de imagens (projetos e certificados)
   Usa <dialog> nativo: Esc, foco preso no modal e retorno do foco ao botão
   de origem já vêm do navegador. Adiciona: setas, deslizar no toque, contador.
   ========================================================================== */
(function () {
  'use strict';
  var P = window.Portfolio;

  P.register('lightbox', function () {
    var dialog = P.$('#viewer');
    var openers = P.$$('[data-gallery]');
    if (!dialog || !openers.length || typeof dialog.showModal !== 'function') return;

    var image = P.$('.viewer-image', dialog);
    var caption = P.$('.viewer-caption', dialog);
    var count = P.$('.viewer-count', dialog);
    var index = 0;

    var altOf = function (button) {
      var img = P.$('img', button);
      return button.getAttribute('data-caption') || (img ? img.getAttribute('alt') || '' : '');
    };

    var show = function (i) {
      index = (i + openers.length) % openers.length;
      var button = openers[index];
      image.src = button.getAttribute('data-full') || P.$('img', button).currentSrc;
      image.alt = altOf(button);
      caption.textContent = altOf(button);
      count.textContent = (index + 1) + ' / ' + openers.length;
      // pré-carrega a vizinha para a troca parecer instantânea
      var next = openers[(index + 1) % openers.length].getAttribute('data-full');
      if (next) { var pre = new Image(); pre.src = next; }
    };
    var open = function (i) {
      show(i);
      document.documentElement.classList.add('is-locked');
      dialog.showModal();
    };
    var labelOpeners = function () {
      openers.forEach(function (button) { button.setAttribute('aria-label', P.t('viewer.zoom', { alt: altOf(button) })); });
    };

    openers.forEach(function (button, i) { button.addEventListener('click', function () { open(i); }); });
    P.$('.viewer-close', dialog).addEventListener('click', function () { dialog.close(); });
    P.$('.viewer-prev', dialog).addEventListener('click', function () { show(index - 1); });
    P.$('.viewer-next', dialog).addEventListener('click', function () { show(index + 1); });
    dialog.addEventListener('close', function () { document.documentElement.classList.remove('is-locked'); image.removeAttribute('src'); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    // deslizar no toque
    var startX = null;
    dialog.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') startX = e.clientX; });
    dialog.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    });

    P.onLanguage(function () { labelOpeners(); if (dialog.open) show(index); });
    labelOpeners();
  });
})();
