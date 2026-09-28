document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------------------------------------------------
     Idioma (PT / EN / ES / RU)
  --------------------------------------------------------------------- */
  const supportedLangs = ['pt', 'en', 'es', 'ru'];
  const browserLang = (navigator.language || 'pt').slice(0, 2);
  const savedLang = localStorage.getItem('lang');
  const initialLang = supportedLangs.includes(savedLang)
    ? savedLang
    : (supportedLangs.includes(browserLang) ? browserLang : 'pt');

  window.applyLanguage(initialLang);

  const langSelect = document.getElementById('lang-select');
  langSelect?.addEventListener('change', (event) => {
    window.applyLanguage(event.target.value);
  });

  /* ---------------------------------------------------------------------
     Scroll indicator
  --------------------------------------------------------------------- */
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      scrollIndicator.style.width = height > 0 ? `${(window.scrollY / height) * 100}%` : '0%';
    });
  }

  /* ---------------------------------------------------------------------
     Theme toggle
  --------------------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  if (localStorage.getItem('theme') === 'light') body.classList.add('light-theme');
  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
  });

  /* ---------------------------------------------------------------------
     Mobile nav
  --------------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  navToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------------------
     Active nav link on scroll
  --------------------------------------------------------------------- */
  const sections = ['about', 'journey', 'skills', 'projects', 'certificates', 'kawanny']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navBysection = new Map(
    [...document.querySelectorAll('.nav-link[data-section]')].map((a) => [a.dataset.section, a])
  );
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = navBysection.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navBysection.forEach((a) => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------------------------------------------------------------------
     Hero terminal typing effect (single orchestrated moment)
  --------------------------------------------------------------------- */
  const terminalCode = document.getElementById('terminal-code');
  if (terminalCode) {
    const lines = [
      { text: 'const dev = {', cls: '' },
      { text: "  name: 'Evertton Thiago',", cls: '' },
      { text: "  focus: 'front-end → full stack',", cls: '' },
      { text: "  stack: ['HTML', 'CSS', 'JS', 'React'],", cls: '' },
      { text: '  learning: true,', cls: '' },
      { text: '};', cls: '' },
    ];
    let li = 0, ci = 0;
    const typeNext = () => {
      if (li >= lines.length) return;
      const current = lines[li];
      if (ci <= current.text.length) {
        const rendered = lines
          .slice(0, li)
          .map((l) => l.text)
          .concat(current.text.slice(0, ci))
          .join('\n');
        terminalCode.textContent = rendered;
        ci += 1;
        setTimeout(typeNext, 16 + Math.random() * 22);
      } else {
        li += 1;
        ci = 0;
        setTimeout(typeNext, 120);
      }
    };
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      terminalCode.textContent = lines.map((l) => l.text).join('\n');
    } else {
      typeNext();
    }
  }

  /* ---------------------------------------------------------------------
     Skill bars fill on view
  --------------------------------------------------------------------- */
  const skillItems = document.querySelectorAll('.skill-item');
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillItems.forEach((item) => skillObserver.observe(item));

  /* ---------------------------------------------------------------------
     Image viewer (lightbox) for gallery images
  --------------------------------------------------------------------- */
  const galleryImages = [...document.querySelectorAll('main img')];
  const imageViewer = document.querySelector('.image-viewer');
  if (imageViewer && galleryImages.length) {
    const viewerImage = imageViewer.querySelector('.image-viewer-image');
    const viewerCaption = imageViewer.querySelector('figcaption');
    const viewerCount = imageViewer.querySelector('.image-viewer-count');
    let currentIndex = 0;

    const showImage = (index) => {
      currentIndex = (index + galleryImages.length) % galleryImages.length;
      const image = galleryImages[currentIndex];
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      viewerCaption.textContent = image.alt;
      viewerCount.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
    };

    galleryImages.forEach((image, index) => {
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `Ampliar imagem: ${image.alt}`);
      image.addEventListener('click', () => {
        showImage(index);
        imageViewer.showModal();
      });
      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          showImage(index);
          imageViewer.showModal();
        }
      });
    });

    imageViewer.querySelector('.image-viewer-close').addEventListener('click', () => imageViewer.close());
    imageViewer.querySelector('.image-viewer-previous').addEventListener('click', () => showImage(currentIndex - 1));
    imageViewer.querySelector('.image-viewer-next').addEventListener('click', () => showImage(currentIndex + 1));
    imageViewer.addEventListener('click', (event) => {
      if (event.target === imageViewer) imageViewer.close();
    });
    imageViewer.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  /* ---------------------------------------------------------------------
     Contact form (front-end only — swap for a real endpoint/service)
  --------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const dict = window.I18N[window.currentLang] || window.I18N.pt;

    if (!name || !email || !message) {
      formNote.textContent = dict['contact.errorFields'];
      return;
    }
    if (!emailRegex.test(email)) {
      formNote.textContent = dict['contact.errorEmail'];
      return;
    }

    const subject = encodeURIComponent(`Mensagem do portfólio de ${name}`);
    const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`);
    window.location.href = `mailto:everttondark3@gmail.com?subject=${subject}&body=${body}`;
    formNote.textContent = dict['contact.success'];
    contactForm.reset();
  });

  /* =======================================================================
     Kawanny — assistente do portfólio
     Tenta usar uma IA real via /api/chat (function serverless).
     Se não houver backend disponível, cai para um modo de reserva local
     bem mais amplo que faz correspondência por relevância, não só
     por palavra exata.
  ======================================================================= */
  const chatForm = document.getElementById('chat-form');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const statusEl = document.getElementById('kawanny-status');

  if (chatForm && chatMessages && chatInput) {
    const history = [];
    let backendAvailable = null; // null = ainda não testado

    let currentStatusMode = 'checking';
    const setStatus = (mode) => {
      currentStatusMode = mode;
      if (!statusEl) return;
      const dict = window.I18N[window.currentLang] || window.I18N.pt;
      const dotClass = mode === 'online' ? 'dot-online' : mode === 'offline' ? 'dot-offline' : 'dot-checking';
      const textKey = mode === 'online' ? 'kawanny.statusOnline' : mode === 'offline' ? 'kawanny.statusOffline' : 'kawanny.statusChecking';
      statusEl.innerHTML = `<span class="dot ${dotClass}"></span> ${dict[textKey]}`;
    };

    // Re-renderiza o status traduzido quando o idioma muda.
    document.addEventListener('languagechange', () => setStatus(currentStatusMode));

    const addMessage = (text, isBot) => {
      const div = document.createElement('div');
      div.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
      const content = document.createElement('div');
      content.className = 'message-content';
      const p = document.createElement('p');
      p.textContent = text;
      content.appendChild(p);
      div.appendChild(content);
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return div;
    };

    const showTyping = () => {
      const div = document.createElement('div');
      div.className = 'message bot-message';
      div.id = 'typing-indicator';
      div.innerHTML = '<div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    const removeTyping = () => document.getElementById('typing-indicator')?.remove();

    /* -----------------------------------------------------------------
       Modo de reserva local: base de conhecimento + pontuação por
       relevância (múltiplas palavras-chave contam mais que uma só),
       cobrindo bem mais tópicos do que uma correspondência exata.
    ----------------------------------------------------------------- */
    const normalize = (text) => text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const noAnswerByLang = {
      pt: 'Ainda não tenho uma resposta pronta pra essa pergunta no modo offline. Tente perguntar sobre o Evertton, os projetos, as habilidades dele, ou sobre HTML, CSS, JavaScript, React, Node.js, Python e Git — ou conecte o backend de IA para respostas ilimitadas (veja o README).',
      en: "I don't have a ready answer for that in offline mode yet. Try asking about Evertton, his projects, his skills, or about HTML, CSS, JavaScript, React, Node.js, Python and Git — or connect the AI backend for unlimited answers (see the README).",
      es: 'Todavía no tengo una respuesta lista para eso en modo sin conexión. Intenta preguntar sobre Evertton, sus proyectos, sus habilidades, o sobre HTML, CSS, JavaScript, React, Node.js, Python y Git — o conecta el backend de IA para respuestas ilimitadas (ver el README).',
      ru: 'Пока у меня нет готового ответа на это в офлайн-режиме. Спросите об Эвертоне, его проектах, навыках, или об HTML, CSS, JavaScript, React, Node.js, Python и Git — либо подключите ИИ-бэкенд для неограниченных ответов (см. README).',
    };
    const tooShortByLang = {
      pt: 'Pode escrever uma pergunta um pouco maior? Assim consigo te ajudar melhor.',
      en: 'Could you write a slightly longer question? That helps me help you better.',
      es: '¿Puedes escribir una pregunta un poco más larga? Así puedo ayudarte mejor.',
      ru: 'Не могли бы вы написать вопрос чуть подробнее? Так мне будет проще помочь.',
    };

    const localAnswer = (message) => {
      const lang = window.currentLang || 'pt';
      const knowledgeBase = window.KNOWLEDGE_BASE[lang] || window.KNOWLEDGE_BASE.pt;
      const norm = normalize(message);
      let best = null;
      let bestScore = 0;
      knowledgeBase.forEach((entry) => {
        let score = 0;
        entry.keys.forEach((key) => {
          if (norm.includes(normalize(key))) score += key.length;
        });
        if (score > bestScore) {
          bestScore = score;
          best = entry;
        }
      });
      if (best) return best.answer;

      if (norm.length < 4) return tooShortByLang[lang] || tooShortByLang.pt;
      return noAnswerByLang[lang] || noAnswerByLang.pt;
    };

    /* -----------------------------------------------------------------
       Tenta o backend real (api/chat). Se a rota não existir (site
       estático sem função serverless), cai pro modo local automaticamente.
    ----------------------------------------------------------------- */
    const askBackend = async (message) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: history.slice(-8), lang: window.currentLang || 'pt' }),
      });
      if (!response.ok) throw new Error(`status ${response.status}`);
      const data = await response.json();
      if (!data.reply) throw new Error('resposta vazia');
      return data.reply;
    };

    const checkBackend = async () => {
      setStatus('checking');
      try {
        const reply = await askBackend('ping de verificação de conexão, responda apenas "ok"');
        backendAvailable = true;
        setStatus('online');
        return reply;
      } catch (err) {
        backendAvailable = false;
        setStatus('offline');
        return null;
      }
    };

    // Verifica a conexão assim que a página carrega, sem poluir o chat.
    checkBackend();

    const handleSend = async () => {
      const message = chatInput.value.trim();
      if (!message) return;

      addMessage(message, false);
      history.push({ role: 'user', content: message });
      chatInput.value = '';
      sendBtn.disabled = true;
      showTyping();

      let reply;
      try {
        if (backendAvailable === null) await checkBackend();
        if (backendAvailable) {
          reply = await askBackend(message);
          setStatus('online');
        } else {
          throw new Error('backend indisponível');
        }
      } catch (err) {
        backendAvailable = false;
        setStatus('offline');
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 400));
        reply = localAnswer(message);
      }

      removeTyping();
      addMessage(reply, true);
      history.push({ role: 'assistant', content: reply });
      sendBtn.disabled = false;
      chatInput.focus();
    };

    chatForm.addEventListener('submit', (event) => {
      event.preventDefault();
      handleSend();
    });
  }
});
