if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const scrollToPageTop = () => {
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  requestAnimationFrame(() => document.documentElement.style.removeProperty('scroll-behavior'));
};

window.addEventListener('pageshow', scrollToPageTop);

document.addEventListener('DOMContentLoaded', () => {
  scrollToPageTop();
  document.body.classList.add('loaded');

  // Scroll indicator
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      scrollIndicator.style.width = scrolled + '%';
    });
  }

  const galleryImages = [...document.querySelectorAll('main img')];
  const imageViewer = document.querySelector('.image-viewer');
  const viewerImage = imageViewer.querySelector('.image-viewer-image');
  const viewerCaption = imageViewer.querySelector('figcaption');
  const viewerCount = imageViewer.querySelector('.image-viewer-count');
  let currentImageIndex = 0;

  const showImage = (index) => {
    currentImageIndex = (index + galleryImages.length) % galleryImages.length;
    const image = galleryImages[currentImageIndex];
    viewerImage.src = image.currentSrc || image.src;
    viewerImage.alt = image.alt;
    viewerCaption.textContent = image.alt;
    viewerCount.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
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
  imageViewer.querySelector('.image-viewer-previous').addEventListener('click', () => showImage(currentImageIndex - 1));
  imageViewer.querySelector('.image-viewer-next').addEventListener('click', () => showImage(currentImageIndex + 1));
  imageViewer.addEventListener('click', (event) => {
    if (event.target === imageViewer) imageViewer.close();
  });
  imageViewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showImage(currentImageIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentImageIndex + 1);
  });

  const effectArea = document.querySelector('.background-effects');
  if (!effectArea) return;

  const createPulse = () => {
    const dot = document.createElement('span');
    dot.className = 'pulse-effect';
    const size = Math.floor(Math.random() * 16) + 10;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${Math.random() * 85 + 5}%`;
    dot.style.top = `${Math.random() * 80 + 8}%`;
    effectArea.appendChild(dot);
    window.setTimeout(() => dot.remove(), 1400);
  };

  createPulse();
  window.setInterval(createPulse, 5200);

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }

  themeToggle.addEventListener('click', () => {
    themeToggle.classList.add('animate');
    setTimeout(() => themeToggle.classList.remove('animate'), 500);
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  const progressFills = document.querySelectorAll('.progress-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => fill.style.width = width, 100);
      }
    });
  }, { threshold: 0.5 });

  progressFills.forEach(fill => observer.observe(fill));

  //  IA Assistant Configuration
  const iaAssistant = {
    // Base de conhecimento expandida
    knowledge: {
      // SOBRE EVERTTON E PORTFÓLIO
      "habilidades|skills": "Sou especialista em HTML, CSS, JavaScript, React, Node.js, Python e Git. Tenho também conhecimento em UI/UX e desenvolvimento full stack. Meu foco principal é front-end com experiência em back-end.",
      
      "projetos|projects": "Tenho trabalhado em diversos projetos como Freelancer Hub (site de freelancers com HTML, CSS, JS, React, Node.js e Python com integração de IA) e Delivery App Web (site responsivo com suporte a app mobile com foco em usabilidade).",
      
      "desenvolvedor|developer|sobre mim|about|quem é": "Sou Evertton Thiago, um desenvolvedor apaixonado por tecnologia que mudou de carreira aos 18 anos. Sou um desenvolvedor em treinamento para full stack com foco em front-end e back-end. Tenho um amor genuíno por resolver problemas e criar soluções inovadoras.",
      
      "certificados|cursos|education": "Completei a Formação DevClub HTML com Rodolfo Mori, Certificação CSS DevClub focando em responsividade e animações, Curso de JavaScript/HTML/CSS com integração a IA, e Masterclass de Git & GitHub. Estou em contínua aprendizagem!",
      
      "contato|fale comigo|email|linkedin": "Você pode entrar em contato comigo através de: Email: everttondark3@gmail.com | Instagram: @evertton.th_ | LinkedIn: linkedin.com/in/evertton-thiago-1953203bb",
      
      "tecnologias|tech|frameworks": "Trabalho com HTML5, CSS3, JavaScript moderno, React para front-end, Node.js para back-end, Python para scripts e automação, Git/GitHub para versionamento, e estou sempre aprendendo novas tecnologias!",
      
      "experiência|background": "Sou novo na área profissional mas tenho dedicado incontáveis horas estudando e aprimorando minhas habilidades. Estou em transição de carreira e ansioso por explorar oportunidades de crescimento.",
      
      "fullstack|full stack": "Estou em formação completa de full stack com foco em front-end e back-end. Tenho conhecimento tanto em tecnologias front-end (HTML, CSS, JavaScript, React) quanto back-end (Node.js, Python).",
      
      "ui|ux|design": "Sou entusiasmado com UI/UX design. Meu objetivo é criar interfaces não apenas funcionais, mas também limpas, elegantes e com excelente experiência do usuário. Trabalho sempre focando em responsividade e acessibilidade.",
      
      "português|espanhol|inglês|idiomas": "Sou fluente em português. Estou aprendendo inglês e espanhol para melhorar minha comunicação e acesso a recursos globais, o que me ajuda a ser um programador mais eficaz em equipes internacionais.",
      
      // PROGRAMAÇÃO E DESENVOLVIMENTO WEB
      "html|estrutura|marcação": "HTML é a linguagem de marcação usada para criar a estrutura de páginas web. Use tags semânticas como <header>, <nav>, <main>, <article>, <footer> para melhor acessibilidade e SEO. HTML5 trouxe muitas melhorias e novas elementos.",
      
      "css|estilo|estilização|responsive": "CSS é usado para estilizar e fazer o layout das páginas. Recomendo usar Flexbox e CSS Grid para layouts modernos. Media queries permitem criar designs responsivos. CSS também oferece animações, transições e transformações 2D/3D.",
      
      "javascript|js|interatividade": "JavaScript é a linguagem de programação da web. Com ele você pode criar interatividade, validar formulários, fazer requisições AJAX/fetch, manipular o DOM, e muito mais. É essencial para desenvolvimento web moderno.",
      
      "react|framework front": "React é uma biblioteca JavaScript para construir interfaces de usuário com componentes reutilizáveis. Usa JSX, state, props e hooks (como useState, useEffect). É ótimo para criar SPAs (Single Page Applications).",
      
      "node|backend|servidor": "Node.js permite usar JavaScript no back-end. Com ele você pode criar servidores web, APIs REST, aplicações em tempo real. Express é o framework mais popular para Node.js.",
      
      "python|backend linguagem": "Python é uma linguagem versátil usada em back-end, data science, automação e IA. Frameworks populares como Django e Flask facilitam criar aplicações web. Python é conhecida por ter sintaxe limpa e legível.",
      
      "git|github|versionamento|controle de versão": "Git é um sistema de controle de versão que permite rastrear mudanças no código. GitHub é uma plataforma para hospedar repositórios Git e colaborar com outros desenvolvedores. É essencial para qualquer desenvolvedor profissional.",
      
      "api|rest|integração": "Uma API REST permite que diferentes aplicações se comuniquem. Use HTTP methods (GET, POST, PUT, DELETE) para operações. JSON é o formato mais comum para trocar dados. Fetch API e Axios são populares em JavaScript.",
      
      "banco de dados|database|sql": "Bancos de dados armazenam informações de forma organizada. SQL é usado em bancos como MySQL, PostgreSQL. NoSQL (MongoDB) é alternativa para dados não estruturados. Escolha baseado nas necessidades do projeto.",
      
      "responsive|mobile|adaptativo": "Design responsivo garante que seu site funcione bem em todos os tamanhos de tela. Use media queries, viewport meta tag, e unidades relativas (rem, %, em). Mobile-first é uma abordagem recomendada.",
      
      // CARREIRA E DESENVOLVIMENTO PROFISSIONAL
      "carreira|profissão|mercado": "O mercado de desenvolvimento web está em alta demanda. Especialize-se em uma ou mais áreas (front-end, back-end, full stack). Construa um portfólio sólido, contribua em open source, e mantenha-se atualizado com as tendências.",
      
      "aprender programação|começar": "Comece com fundamentos: HTML, CSS, JavaScript. Pratique fazendo projetos reais. Estude um framework (React, Vue). Aprender Git é essencial. Use recursos online gratuitos como freeCodeCamp, Codecademy, YouTube.",
      
      "portfólio|projetos|github": "Um bom portfólio mostra seus projetos reais. Adicione projetos variados que demonstram suas habilidades. GitHub é vital - mantenha seus repositórios públicos e bem documentados. Descreva bem o que faz em cada projeto.",
      
      "freelancer|autônomo|empresa": "Como freelancer você tem mais flexibilidade mas renda menos previsível. Em empresas há mais estabilidade. Ambas têm vantagens - escolha baseado em seus objetivos de vida e carreira.",
      
      // TECNOLOGIA GERAL
      "ia|inteligência artificial|machine learning": "IA e Machine Learning estão transformando a tecnologia. ChatGPT é um exemplo de IA generativa. APIs de IA como OpenAI, Google Cloud AI permitem integrar IA em aplicações. É um campo em rápida evolução.",
      
      "web3|blockchain|criptografia": "Blockchain é a tecnologia por trás de criptomoedas. Web3 promete uma internet mais descentralizada. Smart contracts usam linguagens como Solidity. Ainda é um campo em desenvolvimento com muitas oportunidades.",
      
      "cloud|aws|azure|firebase": "Cloud computing permite hospedar aplicações sem gerenciar servidores físicos. AWS, Google Cloud, Azure são os principais provedores. Firebase oferece backend como serviço (BaaS) com banco de dados em tempo real.",
      
      "devops|docker|containerização": "DevOps combina desenvolvimento e operações. Docker permite empacotar aplicações em containers. Kubernetes orquestra containers. CI/CD automatiza testes e deployment.",
      
      "performance|otimização|web vitals": "Performance é crítica para UX. Minimize JavaScript/CSS, use lazy loading, otimize imagens. Web Vitals (Largest Contentful Paint, First Input Delay, Cumulative Layout Shift) são métricas importantes.",
      
      // ASSUNTOS GERAIS
      "oi|olá|opa|hey": "Olá! 👋 Seja bem-vindo! Sou a Kawanny, uma assistente de IA versátil. Posso conversar sobre Evertton e seu portfólio, desenvolvimento web, programação, tecnologia, carreira, ou praticamente qualquer outro assunto. Como posso ajudar?",
      
      "tudo bem|como vai|e você": "Tudo bem por aqui! 😊 Estou aqui para ajudar e conversar. Pode me fazer perguntas sobre programação, tecnologia, carreira, Evertton e seu portfólio, ou qualquer outro assunto que te interessa!",
      
      "obrigado|thanks|valeu": "De nada! 🎉 Se precisar de mais ajuda, é só chamar. Estou sempre aqui para conversar e responder suas dúvidas!",
      
      "piada|brincadeira|humor": "Você quer uma piada? Aqui vai: Por que programadores preferem o dark mode? Porque a luz atrai bugs! 😂 Ou talvez você prefira: Um SQL query entra em um bar, caminha até uma mesa com duas garotas e diz: 'Posso unir vocês?'",
      
      "exercício|saúde|bem estar": "Exercitar-se é importante mesmo para programadores! Sair do computador, fazer atividades físicas melhora foco e produtividade. Pause periodicamente para alongar. Uma mente saudável em um corpo saudável rende mais no trabalho.",
      
      "música|diversão|hobby": "Música é ótima para focar enquanto programa! Muitos devs gostam de rock, eletrônico ou lo-fi hip hop. Outros hobbies populares: jogos, leitura, filmes, podcasts. Balance trabalho com diversão é essencial.",
      
      "futuro|2030|próximos anos": "A tecnologia vai continuar evoluindo rapidamente. IA será mais integrada em tudo. Web3 pode transformar a internet. Jobs em tech devem crescer. O aprendizado contínuo será mais importante que nunca.",
      
      "motivação|desanimar|dificuldade": "Programação é desafiadora, mas muito gratificante! Se estiver desmotivado: tire um tempo, estude coisas que te interessam, faça pequenos projetos, busque comunidade online. Todo dev experiente passou por dificuldades também.",
      
      "console.log|debug|erro": "console.log() é sua melhor amiga para debug! Coloque logs estrategicamente para entender o flow. Use DevTools do navegador (F12). Aprenda a ler mensagens de erro - elas dizem muito! Try/catch para lidar com exceções.",
    },

    // Função para encontrar resposta com lógica melhorada
    findResponse: function(userMessage) {
      const lowerMessage = userMessage.toLowerCase().trim();
      
      // Procura por palavras-chave exatas primeiro
      for (let keywords in this.knowledge) {
        const keywordsList = keywords.split('|');
        if (keywordsList.some(keyword => lowerMessage.includes(keyword))) {
          return this.knowledge[keywords];
        }
      }
      
      // Se não encontrou, tenta respostas criativas para perguntas comuns
      if (lowerMessage.includes('como') && lowerMessage.includes('você')) {
        return "Sou a Kawanny, uma assistente de IA criada para ajudar no portfólio de Evertton e conversar sobre tecnologia! Posso falar sobre programação, desenvolvimento web, carreira tech, ou praticamente qualquer coisa. O que você gostaria de saber?";
      }
      
      if (lowerMessage.includes('qual') && lowerMessage.includes('melhor')) {
        return "Depende muito do contexto! A 'melhor' tecnologia/ferramenta varia conforme o projeto. Em geral, escolha baseado em: requisitos do projeto, performance necessária, curva de aprendizado, comunidade disponível, e suas preferências pessoais.";
      }
      
      if (lowerMessage.includes('por que') || lowerMessage.includes('porquê')) {
        return "Ótima pergunta reflexiva! Muitas vezes 'por que' é a pergunta mais importante que um desenvolvedor faz. Entender o 'por que' por trás das decisões de design e arquitetura melhora muito a qualidade do código.";
      }
      
      if (lowerMessage.length < 5) {
        return "Sua mensagem foi muito curta! Pode ser um oi, tudo bem? 😄 Ou você está esperando eu adivinhar? Fique livre para fazer uma pergunta maior sobre programação, tecnologia, ou sobre Evertton!";
      }
      
      // Resposta genérica amigável para perguntas não identificadas
      const respostasAleatorias = [
        "Que pergunta interessante! 🤔 Não tenho uma resposta específica pré-programada para isso, mas adorei o pensamento. Você gostaria de falar sobre programação, tecnologia, ou sobre Evertton?",
        "Hmm, essa é uma pergunta criativa! Embora não tenha uma resposta direta, posso conversar sobre muitos tópicos relacionados a tech e desenvolvimento. Tenta me perguntar sobre algo nessa área!",
        "Adorei sua curiosidade! 🧠 Se for sobre programação, tech, desenvolvimento web ou Evertton, posso ajudar muito. Tenta reformular a pergunta para um desses temas?",
        "Você está me testando? 😄 Posso conversar sobre praticamente qualquer assunto, mas sou especialista em programação e tecnologia. Tenta uma pergunta nessa área!",
        "Ótimo questionamento! Apesar de ter muita informação, essa pergunta em particular não está no meu banco de dados. Mas fique livre para perguntar sobre desenvolvimento, tech, carreira ou sobre Evertton!",
      ];
      
      return respostasAleatorias[Math.floor(Math.random() * respostasAleatorias.length)];
    }
  };

  // Chat functionality
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  function addMessage(text, isBot = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
    
    if (isBot) {
      messageDiv.innerHTML = `
        <span class="bot-icon">👑</span>
        <div class="message-content">
          <p>${text}</p>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>${text}</p>
        </div>
      `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.id = 'typing-indicator';
    messageDiv.innerHTML = `
      <span class="bot-icon">👑</span>
      <div class="message-content">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) {
      typing.remove();
    }
  }

  function handleSendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;

    // Adiciona mensagem do usuário
    addMessage(message, false);
    chatInput.value = '';
    sendBtn.disabled = true;

    // Mostra indicador de digitação
    showTyping();

    // Simula delay de processamento
    setTimeout(() => {
      removeTyping();
      const response = iaAssistant.findResponse(message);
      addMessage(response, true);
      sendBtn.disabled = false;
      chatInput.focus();
    }, 800 + Math.random() * 700);
  }

  sendBtn.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Focus no input quando a página carrega
  if (chatInput) {
    chatInput.focus();
  }

  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
''  
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um email válido.');
      return;
    }

    // For demo, just log and reset
    console.log('Mensagem enviada:', { name, email, message });
    alert('Mensagem enviada com sucesso! (Simulação)');
    contactForm.reset();
  });
});
