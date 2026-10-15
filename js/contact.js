/* ==========================================================================
   js/contact.js — copiar e-mail e formulário de contato
   O site é estático: o formulário valida no navegador e abre o app de e-mail
   (mailto:). Não há servidor recebendo mensagens — o texto de sucesso é honesto
   quanto a isso. Para envio direto, veja README (Formspree/Resend).
   ========================================================================== */
(function () {
  'use strict';
  var P = window.Portfolio;
  var EMAIL = 'everttondark3@gmail.com';

  P.register('contact', function () {
    /* ---------- copiar e-mail ---------- */
    var copyBtn = P.$('#copy-mail');
    var copyStatus = P.$('#copy-status');
    if (copyBtn) {
      var timer = 0;
      var done = function (ok) {
        if (copyStatus) copyStatus.textContent = P.t(ok ? 'contact.copied' : 'contact.copyFailed');
        if (ok) {
          copyBtn.textContent = P.t('contact.copied');
          clearTimeout(timer);
          timer = setTimeout(function () { copyBtn.textContent = P.t('contact.copy'); }, 2000);
        }
      };
      var fallbackCopy = function () {
        var area = document.createElement('textarea');
        area.value = EMAIL; area.setAttribute('readonly', ''); area.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
        document.body.appendChild(area); area.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        area.remove();
        return ok;
      };
      copyBtn.addEventListener('click', function () {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(EMAIL).then(function () { done(true); }, function () { done(fallbackCopy()); });
        } else {
          done(fallbackCopy());
        }
      });
    }

    /* ---------- formulário ---------- */
    var form = P.$('#contact-form');
    var note = P.$('#form-note');
    if (!form) return;
    var fields = {
      name: { el: P.$('#name'), error: P.$('#name-error'), msg: 'contact.err.name', valid: function (v) { return v.length > 0; } },
      email: { el: P.$('#email'), error: P.$('#email-error'), msg: 'contact.err.email', valid: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); } },
      message: { el: P.$('#message'), error: P.$('#message-error'), msg: 'contact.err.message', valid: function (v) { return v.length > 0; } },
    };
    var keys = Object.keys(fields);

    var setNote = function (text, state) { if (note) { note.textContent = text; if (state) note.setAttribute('data-state', state); else note.removeAttribute('data-state'); } };
    var paintField = function (field, ok) {
      field.el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      field.error.textContent = ok ? '' : P.t(field.msg);
    };

    keys.forEach(function (key) {
      var field = fields[key];
      field.el.addEventListener('input', function () {
        if (field.el.getAttribute('aria-invalid') === 'true' && field.valid(field.el.value.trim())) paintField(field, true);
        setNote('');
      });
      // Sem validação no blur de propósito: inserir o erro ali empurra o botão "Enviar" para baixo
      // entre o mousedown e o mouseup e o clique se perde. Erros aparecem no envio.
    });
    P.onLanguage(function () {
      keys.forEach(function (key) { if (fields[key].el.getAttribute('aria-invalid') === 'true') fields[key].error.textContent = P.t(fields[key].msg); });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var firstInvalid = null;
      keys.forEach(function (key) {
        var field = fields[key];
        var ok = field.valid(field.el.value.trim());
        paintField(field, ok);
        if (!ok && !firstInvalid) firstInvalid = field.el;
      });
      if (firstInvalid) {
        setNote(P.t('contact.errorSummary'), 'error');
        firstInvalid.focus();
        return;
      }
      var name = fields.name.el.value.trim();
      var subject = P.t('contact.mailSubject', { name: name });
      var body = P.t('contact.labelName') + ': ' + name + '\n' +
                 P.t('contact.labelEmail') + ': ' + fields.email.el.value.trim() + '\n\n' +
                 fields.message.el.value.trim();
      // mantém o que o visitante escreveu: se o app de e-mail não abrir, nada se perde
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      setNote(P.t('contact.success'), 'success');
    });
  });
})();
