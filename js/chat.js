/* ==========================================================================
   js/chat.js — Kawanny, a assistente do portfólio
   1) Tenta a IA real via /api/chat (função serverless, ver api/chat.js).
   2) Sem backend (site estático / sem chave): responde com a base local
      (js/i18n/knowledge.js, carregada só quando necessária).
   ========================================================================== */
(function () {
  'use strict';
  var P = window.Portfolio;

  var NO_ANSWER = {
    pt: 'Ainda não tenho uma resposta pronta pra essa pergunta no modo offline. Tente perguntar sobre o Evertton, os projetos, as habilidades dele, ou sobre HTML, CSS, JavaScript, React, Node.js, Python e Git.',
    en: "I don't have a ready answer for that in offline mode yet. Try asking about Evertton, his projects, his skills, or about HTML, CSS, JavaScript, React, Node.js, Python and Git.",
    es: 'Todavía no tengo una respuesta lista para eso en modo sin conexión. Intenta preguntar sobre Evertton, sus proyectos, sus habilidades, o sobre HTML, CSS, JavaScript, React, Node.js, Python y Git.',
    ru: 'Пока у меня нет готового ответа на это в офлайн-режиме. Спросите об Эвертоне, его проектах, навыках, или об HTML, CSS, JavaScript, React, Node.js, Python и Git.',
  };
  var TOO_SHORT = {
    pt: 'Pode escrever uma pergunta um pouco maior? Assim consigo te ajudar melhor.',
    en: 'Could you write a slightly longer question? That helps me help you better.',
    es: '¿Puedes escribir una pregunta un poco más larga? Así puedo ayudarte mejor.',
    ru: 'Не могли бы вы написать вопрос чуть подробнее? Так мне будет проще помочь.',
  };

  var normalize = function (text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  /* Pontuação por relevância. Chaves curtas (≤3 letras) só valem como palavra
     inteira — antes "git" respondia a "digital" e "oi" a "dois". */
  P.localAnswer = function (message, lang, base) {
    var list = (base && (base[lang] || base.pt)) || [];
    var norm = normalize(message);
    var tokens = norm.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    var best = null, bestScore = 0;
    list.forEach(function (entry) {
      var score = 0;
      entry.keys.forEach(function (key) {
        var k = normalize(key);
        var hit = k.length <= 3 ? tokens.indexOf(k) !== -1 : norm.indexOf(k) !== -1;
        if (hit) score += k.length;
      });
      if (score > bestScore) { bestScore = score; best = entry; }
    });
    if (best) return best.answer;
    if (norm.length < 4) return TOO_SHORT[lang] || TOO_SHORT.pt;
    return NO_ANSWER[lang] || NO_ANSWER.pt;
  };

  P.register('chat', function () {
    var form = P.$('#chat-form');
    var log = P.$('#chat-messages');
    var input = P.$('#chat-input');
    var send = P.$('#send-btn');
    var statusEl = P.$('#kawanny-status');
    if (!form || !log || !input) return;

    var history = [];
    var backend = null;      // null = não testado · true = IA ativa · false = modo local
    var mode = 'checking';
    var busy = false;

    /* ---------- status ---------- */
    var paintStatus = function () {
      if (!statusEl) return;
      var key = mode === 'online' ? 'kawanny.statusOnline' : mode === 'offline' ? 'kawanny.statusOffline' : 'kawanny.statusChecking';
      statusEl.innerHTML = '';
      var dot = document.createElement('span');
      dot.className = 'dot dot-' + mode;
      dot.setAttribute('aria-hidden', 'true');
      var text = document.createElement('span');
      text.textContent = P.t(key);
      statusEl.appendChild(dot);
      statusEl.appendChild(text);
    };
    var setMode = function (next) { mode = next; paintStatus(); };
    P.onLanguage(paintStatus);

    /* ---------- mensagens ---------- */
    var add = function (text, bot) {
      var row = document.createElement('div');
      row.className = 'message ' + (bot ? 'bot-message' : 'user-message');
      var bubble = document.createElement('div');
      bubble.className = 'message-content';
      var p = document.createElement('p');
      p.textContent = text;
      bubble.appendChild(p);
      row.appendChild(bubble);
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
    };
    var typing = null;
    var showTyping = function () {
      typing = document.createElement('div');
      typing.className = 'message bot-message';
      typing.setAttribute('aria-hidden', 'true');
      typing.innerHTML = '<div class="message-content"><div class="typing"><span></span><span></span><span></span></div></div>';
      log.appendChild(typing);
      log.scrollTop = log.scrollHeight;
    };
    var hideTyping = function () { if (typing) { typing.remove(); typing = null; } };

    /* ---------- backend ---------- */
    var fetchJson = function (url, options, ms) {
      var controller = 'AbortController' in window ? new AbortController() : null;
      var timer = controller ? setTimeout(function () { controller.abort(); }, ms) : 0;
      options = options || {};
      if (controller) options.signal = controller.signal;
      return fetch(url, options).then(function (response) {
        clearTimeout(timer);
        if (!response.ok) throw new Error('status ' + response.status);
        return response.json();
      }, function (error) { clearTimeout(timer); throw error; });
    };

    var checkBackend = function () {
      setMode('checking');
      return fetchJson('/api/chat', null, 4000).then(function (data) {
        if (!data || !data.ai) throw new Error('sem IA');
        backend = true; setMode('online');
      }).catch(function () { backend = false; setMode('offline'); });
    };

    var askBackend = function (message, past) {
      return fetchJson('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, history: past.slice(-8), lang: P.lang }),
      }, 20000).then(function (data) {
        if (!data || !data.reply) throw new Error('resposta vazia');
        return data.reply;
      });
    };

    var askLocal = function (message) {
      var ready = window.KNOWLEDGE_BASE ? Promise.resolve() : P.loadScript('js/i18n/knowledge.js?v=20261011').catch(function () { /* sem base: resposta genérica */ });
      return ready.then(function () { return P.localAnswer(message, P.lang, window.KNOWLEDGE_BASE); });
    };

    /* ---------- envio ---------- */
    var submit = function (raw, refocus) {
      var message = (raw || '').trim();
      if (!message || busy) return;
      busy = true;
      log.setAttribute('aria-busy', 'true');
      if (send) send.disabled = true;
      input.disabled = true;

      var past = history.slice();               // histórico SEM a mensagem atual (evita duplicá-la no backend)
      add(message, false);
      history.push({ role: 'user', content: message });
      input.value = '';
      showTyping();

      var answer = (backend === null ? checkBackend() : Promise.resolve())
        .then(function () { return backend ? askBackend(message, past) : Promise.reject(new Error('local')); })
        .then(function (reply) { setMode('online'); return reply; })
        .catch(function () {
          if (backend) { backend = false; setMode('offline'); }
          return new Promise(function (resolve) { setTimeout(resolve, 450 + Math.random() * 350); }).then(function () { return askLocal(message); });
        });

      answer.then(function (reply) {
        hideTyping();
        add(reply, true);
        history.push({ role: 'assistant', content: reply });
      }).then(function () {
        busy = false;
        log.removeAttribute('aria-busy');
        if (send) send.disabled = false;
        input.disabled = false;
        if (refocus) input.focus({ preventScroll: true });
      });
    };

    form.addEventListener('submit', function (event) { event.preventDefault(); submit(input.value, true); });
    P.$$('.suggestion').forEach(function (button) {
      button.addEventListener('click', function () { submit(button.textContent, false); });
    });

    paintStatus();
    checkBackend();
  });
})();
