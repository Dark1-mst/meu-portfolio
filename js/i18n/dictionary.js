/* ==========================================================================
   js/i18n/dictionary.js — textos da interface em PT / EN / ES / RU
   Define window.I18N. Fonte única de tradução: o HTML traz o PT como padrão
   (data-i18n="chave") e js/language.js troca pelos textos daqui.
   Placeholders: {n}, {name}, {alt} são substituídos em tempo de execução.
   Para adicionar um texto: crie a chave nos 4 idiomas (o QA verifica a paridade).
   ========================================================================== */
window.I18N = {
  pt: {
    // meta
    "meta.title": "Evertton Thiago — Desenvolvedor Front-end",
    "meta.description": "Portfólio de Evertton Thiago, desenvolvedor front-end em transição para full stack. Projetos, habilidades e certificados em HTML, CSS, JavaScript, React, Node.js e Python.",

    // a11y
    "a11y.skip": "Pular para conteúdo principal",
    "a11y.newTab": "(abre em nova aba)",

    // nav
    "nav.about": "Sobre",
    "nav.journey": "Jornada",
    "nav.skills": "Skills",
    "nav.projects": "Projetos",
    "nav.certificates": "Certificados",
    "nav.kawanny": "Kawanny IA",
    "nav.contact": "Contato",
    "nav.label": "Navegação principal",
    "nav.home": "Evertton Thiago — ir para o início",
    "nav.menuOpen": "Abrir menu",
    "nav.menuClose": "Fechar menu",

    // lang
    "lang.label": "Idioma",

    // theme
    "theme.toLight": "Mudar para o tema claro",
    "theme.toDark": "Mudar para o tema escuro",

    // hero
    "hero.availability": "Disponível para projetos, freelas e oportunidades de estágio",
    "hero.lede": "Crio software que resolve problemas reais e entrega valor desde o primeiro clique, com interfaces performáticas, acessíveis e bem pensadas.",
    "hero.ctaProjects": "Ver projetos",
    "hero.ctaContact": "Solicitar projeto",
    "hero.role": "Desenvolvedor front-end em transição para full stack.",
    "hero.srRole": ", desenvolvedor front-end em transição para full stack",
    "hero.scrollCue": "Rolar para ver os projetos",

    // about
    "about.title": "Sobre",
    "about.lede": "Um pouco da minha trajetória até aqui.",
    "about.role": "Desenvolvedor Front-end",
    "about.p1": "Comecei no desenvolvimento web com a intenção de transformar curiosidade em produto. Hoje invisto em projetos reais, lógica, performance e clareza de código para construir experiências que entregam valor — e não apenas estética.",
    "about.p2": "Meu foco vai além do front-end: evoluir em arquitetura, lógica de negócio e integrações para criar soluções mais consistentes, fáceis de manter e mais fortes no contexto real do usuário.",
    "about.p3": "Também estou ampliando o inglês e o espanhol para colaborar com times e clientes de diferentes lugares, além de consumir documentação técnica com autonomia e velocidade.",
    "about.list1": "Foco em experiência real de uso, e não apenas em aparência visual",
    "about.list2": "Interfaces responsivas, com atenção a desempenho, acessibilidade e clareza de implementação",
    "about.list3": "Aprendizado constante por meio de projetos práticos, desafios reais e código que se sustenta",
    "about.photoAlt": "Foto de Evertton Thiago",

    // skills
    "skills.title": "Habilidades",
    "skills.lede": "Ferramentas e princípios com os quais eu construo interfaces e sistemas com consistência, clareza e foco em resultado.",
    "skills.t1": "No dia a dia",
    "skills.t2": "Aprofundando",
    "skills.t3": "Junto com o código",
    "skills.resp": "Responsividade",
    "skills.a11y": "Acessibilidade",
    "skills.projects": "Projetos: {n}",
    "skills.studying": "Em estudo",
    "skills.certified": "Certificado",

    // journey
    "journey.title": "Minha evolução",
    "journey.lede": "Um caminho construído com prática, curiosidade e foco em entregar software que realmente funciona.",
    "journey.p1.period": "O começo",
    "journey.p1.title": "Primeiros passos rumo à engenharia de software",
    "journey.p1.desc": "Comecei transformando curiosidade em prática, com HTML, CSS e JavaScript como base para entender como a web funciona na prática.",
    "journey.p2.period": "Na prática",
    "journey.p2.title": "Construindo interfaces que resolvem problemas reais",
    "journey.p2.desc": "Passei a desenvolver ferramentas e experiências com foco em usabilidade, clareza e valor para quem vai usar o produto.",
    "journey.p3.period": "Agora",
    "journey.p3.title": "Ampliando a visão para full stack",
    "journey.p3.desc": "Estou aprofundando React, Node.js e Python para entender melhor a construção completa de produtos, da interface à lógica que sustenta tudo.",
    "journey.p4.period": "Próximo passo",
    "journey.p4.title": "Contribuir em times reais e continuar evoluindo",
    "journey.p4.desc": "Busco uma oportunidade para aprender em equipe, colaborar com foco e entregar valor desde os primeiros desafios.",

    // projects
    "projects.title": "Projetos",
    "projects.lede": "Alguns trabalhos que mostram como eu penso, construo e entrego interfaces com foco em valor real.",
    "projects.statusComplete": "Concluído",
    "projects.statusProgress": "Em desenvolvimento",
    "projects.p1.desc": "Ferramenta com integração de IA para gerar temas escuros personalizados, combinando experiência visual com automação para acelerar a criação de interfaces mais consistentes.",
    "projects.p2.desc": "Aplicação de delivery com foco em mobile-first, pensando em fluxo de compra rápido, navegação clara e usabilidade em telas pequenas sem perder legibilidade e velocidade.",
    "projects.p3.desc": "Conversor de moedas com interface clara e direta, desenvolvido para entrega de informação rápida e conversão simples entre diferentes moedas.",
    "projects.linkGithub": "Ver no GitHub",
    "projects.p1.video": "Demonstração em vídeo do Dark Generator",
    "projects.p2.video": "Demonstração em vídeo do Delivery App Web",
    "projects.p2.image": "Mockup do Delivery App Web em desktop, notebook, tablet e celular",
    "projects.p3.image": "Interface do Dark Converter, um conversor de moedas",
    "projects.p2.mockupLink": "Ver mockup responsivo",

    // tag
    "tag.ia": "IA",
    "tag.responsive": "Responsivo",
    "tag.jsIa": "JS + IA",

    // certificates
    "certificates.title": "Certificados",
    "certificates.lede": "Formações que reforçam a base, a disciplina e a capacidade de construir software com qualidade.",
    "certificates.c1.title": "Formação DevClub HTML — Rodolfo Mori",
    "certificates.c1.desc": "Curso prático focado em projetos reais, boas práticas de desenvolvimento e criação de interfaces responsivas com qualidade.",
    "certificates.c2.title": "Certificação CSS DevClub",
    "certificates.c2.desc": "Aprofundamento em layout moderno, responsividade e animações com Flexbox, Grid e transições mais refinadas.",
    "certificates.c3.title": "JavaScript, HTML e CSS com integração a IA",
    "certificates.c3.desc": "Desenvolvimento web com foco em integrar inteligência artificial para melhorar produtividade, criatividade e qualidade de entrega.",
    "certificates.c4.title": "Git & GitHub Masterclass",
    "certificates.c4.desc": "Versionamento, colaboração em equipe, organização de branches e commits com um workflow mais profissional e escalável.",
    "certificates.issued2026": "Emitido em 2026",
    "certificates.added2026": "Adicionado em 2026",
    "certificates.inProgress": "Em andamento",
    "certificates.next.title": "Próxima formação: back-end com Node.js",
    "certificates.next.desc": "Continuando a jornada full stack — essa seção evolui conforme novas etapas e novos desafios forem concluídos.",
    "certificates.c1.alt": "Certificado de conclusão da Formação DevClub HTML",
    "certificates.c2.alt": "Certificado de CSS Intermediário da DevClub",
    "certificates.c3.alt": "Certificado de JavaScript, HTML e CSS com integração a IA",
    "certificates.c4.alt": "Certificado de Git & GitHub Masterclass",

    // kawanny
    "kawanny.title": "Fale com a Kawanny",
    "kawanny.lede": "Assistente do portfólio. Pergunte sobre meus projetos, habilidades, ou qualquer outra coisa.",
    "kawanny.statusChecking": "verificando conexão…",
    "kawanny.statusOnline": "IA conectada",
    "kawanny.statusOffline": "modo offline (respostas locais)",
    "kawanny.greeting": "Oi! Sou a Kawanny 👋 Pode me perguntar sobre o Evertton, os projetos dele, tecnologia em geral, ou qualquer outra dúvida — vou fazer o meu melhor pra responder de verdade, não só com frases prontas.",
    "kawanny.placeholder": "Digite sua pergunta...",
    "kawanny.send": "Enviar",
    "kawanny.log": "Conversa com a Kawanny",
    "kawanny.inputLabel": "Sua pergunta para a Kawanny",
    "kawanny.suggestions": "Perguntas sugeridas",
    "kawanny.s1": "Quais são os projetos dele?",
    "kawanny.s2": "Quais tecnologias ele usa?",
    "kawanny.s3": "Como entro em contato com ele?",

    // contact
    "contact.copy": "Copiar e-mail",
    "contact.copied": "E-mail copiado",
    "contact.title": "Contato",
    "contact.lede": "Me manda uma mensagem — respondo por aqui, e-mail ou LinkedIn.",
    "contact.labelName": "Nome",
    "contact.labelEmail": "Email",
    "contact.labelMessage": "Mensagem",
    "contact.send": "Enviar mensagem",
    "contact.success": "Mensagem pronta no seu app de e-mail. Se ele não abriu, copie o endereço acima e escreva direto.",
    "contact.cardEmail": "Email",
    "contact.copyFailed": "Não foi possível copiar. Selecione o e-mail e copie manualmente.",
    "contact.err.name": "Informe seu nome.",
    "contact.err.email": "Digite um e-mail válido.",
    "contact.err.message": "Escreva uma mensagem.",
    "contact.errorSummary": "Revise os campos destacados.",
    "contact.mailSubject": "Mensagem do portfólio de {name}",
    "contact.formLabel": "Formulário de contato",

    // footer
    "footer.top": "Voltar ao topo",

    // viewer
    "viewer.label": "Visualizador de imagens",
    "viewer.close": "Fechar imagem",
    "viewer.prev": "Imagem anterior",
    "viewer.next": "Próxima imagem",
    "viewer.zoom": "Ampliar imagem: {alt}",
  },

  en: {
    // meta
    "meta.title": "Evertton Thiago — Front-end Developer",
    "meta.description": "Portfolio of Evertton Thiago, a front-end developer transitioning into full stack. Projects, skills and certificates in HTML, CSS, JavaScript, React, Node.js and Python.",

    // a11y
    "a11y.skip": "Skip to main content",
    "a11y.newTab": "(opens in a new tab)",

    // nav
    "nav.about": "About",
    "nav.journey": "Journey",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.certificates": "Certificates",
    "nav.kawanny": "Kawanny AI",
    "nav.contact": "Contact",
    "nav.label": "Main navigation",
    "nav.home": "Evertton Thiago — back to top",
    "nav.menuOpen": "Open menu",
    "nav.menuClose": "Close menu",

    // lang
    "lang.label": "Language",

    // theme
    "theme.toLight": "Switch to light theme",
    "theme.toDark": "Switch to dark theme",

    // hero
    "hero.availability": "Available for projects, freelance work and internships",
    "hero.lede": "I build software that solves real problems and creates value from the first click, with high-performance, accessible, well-thought-out interfaces.",
    "hero.ctaProjects": "View projects",
    "hero.ctaContact": "Request a project",
    "hero.role": "Front-end developer transitioning into full stack.",
    "hero.srRole": ", front-end developer transitioning into full stack",
    "hero.scrollCue": "Scroll to see the projects",

    // about
    "about.title": "About",
    "about.lede": "A bit of my story so far.",
    "about.role": "Front-end Developer",
    "about.p1": "I started in web development with the goal of turning curiosity into product. Today I invest in real projects, logic, performance, and code clarity to build experiences that deliver value — not just appearance.",
    "about.p2": "My focus goes beyond front-end: expanding into architecture, business logic, and integrations to build solutions that are more consistent, easier to maintain, and stronger in real user contexts.",
    "about.p3": "I am also improving my English and Spanish to collaborate with teams and clients in different places, while consuming technical documentation with more autonomy and speed.",
    "about.list1": "Focused on real usability, not merely visual polish",
    "about.list2": "Responsive interfaces with attention to performance, accessibility, and clean implementation",
    "about.list3": "Constant learning through practical projects, real challenges, and code that can be sustained",
    "about.photoAlt": "Photo of Evertton Thiago",

    // skills
    "skills.title": "Skills",
    "skills.lede": "Tools and principles I use to build interfaces and systems with consistency, clarity, and a focus on results.",
    "skills.t1": "Every day",
    "skills.t2": "Going deeper",
    "skills.t3": "Alongside the code",
    "skills.resp": "Responsive design",
    "skills.a11y": "Accessibility",
    "skills.projects": "Projects: {n}",
    "skills.studying": "Studying",
    "skills.certified": "Certified",

    // journey
    "journey.title": "My evolution",
    "journey.lede": "A path built through practice, curiosity, and a focus on shipping software that actually works.",
    "journey.p1.period": "The beginning",
    "journey.p1.title": "First steps toward software engineering",
    "journey.p1.desc": "I started turning curiosity into practice, using HTML, CSS, and JavaScript to understand how the web works in real conditions.",
    "journey.p2.period": "In practice",
    "journey.p2.title": "Building interfaces that solve real problems",
    "journey.p2.desc": "I began developing tools and experiences designed around usability, clarity, and value for the people using them.",
    "journey.p3.period": "Now",
    "journey.p3.title": "Expanding the vision toward full stack",
    "journey.p3.desc": "I am deepening my React, Node.js, and Python skills to understand how complete products are built, from interface to the logic behind them.",
    "journey.p4.period": "Next step",
    "journey.p4.title": "Contributing in real teams and continuing to grow",
    "journey.p4.desc": "I am looking for an opportunity to learn in a team, collaborate with focus, and deliver value from the first challenges.",

    // projects
    "projects.title": "Projects",
    "projects.lede": "A few examples of how I think, build, and deliver interfaces with focus on real value.",
    "projects.statusComplete": "Completed",
    "projects.statusProgress": "In development",
    "projects.p1.desc": "AI-powered tool for generating custom dark themes, combining visual experience with automation to accelerate the creation of more consistent interfaces.",
    "projects.p2.desc": "Delivery application with a mobile-first approach, focused on fast purchase flow, clear navigation, and usability on small screens without losing legibility or speed.",
    "projects.p3.desc": "Currency converter with a clean, direct interface designed to deliver information quickly and simplify conversions between different currencies.",
    "projects.linkGithub": "View on GitHub",
    "projects.p1.video": "Video demo of Dark Generator",
    "projects.p2.video": "Video demo of Delivery App Web",
    "projects.p2.image": "Delivery App Web mockup on desktop, laptop, tablet and phone",
    "projects.p3.image": "Dark Converter interface, a currency converter",
    "projects.p2.mockupLink": "View responsive mockup",

    // tag
    "tag.ia": "AI",
    "tag.responsive": "Responsive",
    "tag.jsIa": "JS + AI",

    // certificates
    "certificates.title": "Certificates",
    "certificates.lede": "Training that reinforces the foundation, discipline, and capacity to build quality software.",
    "certificates.c1.title": "DevClub HTML Program — Rodolfo Mori",
    "certificates.c1.desc": "Hands-on course focused on real projects, good software practices, and building responsive interfaces with quality.",
    "certificates.c2.title": "DevClub CSS Certification",
    "certificates.c2.desc": "Deepening in modern layout, responsiveness, and animations using Flexbox, Grid, and more refined transitions.",
    "certificates.c3.title": "JavaScript, HTML and CSS with AI integration",
    "certificates.c3.desc": "Web development focused on integrating artificial intelligence to improve productivity, creativity, and delivery quality.",
    "certificates.c4.title": "Git & GitHub Masterclass",
    "certificates.c4.desc": "Version control, team collaboration, branch organization, and commits with a more professional, scalable workflow.",
    "certificates.issued2026": "Issued in 2026",
    "certificates.added2026": "Added in 2026",
    "certificates.inProgress": "In progress",
    "certificates.next.title": "Next up: back-end with Node.js",
    "certificates.next.desc": "Continuing the full stack journey — this section evolves as new stages and challenges are completed.",
    "certificates.c1.alt": "Certificate of completion for the DevClub HTML program",
    "certificates.c2.alt": "DevClub Intermediate CSS certificate",
    "certificates.c3.alt": "Certificate of JavaScript, HTML and CSS with AI integration",
    "certificates.c4.alt": "Git & GitHub Masterclass certificate",

    // kawanny
    "kawanny.title": "Chat with Kawanny",
    "kawanny.lede": "This portfolio's assistant. Ask about my projects, skills, or anything else.",
    "kawanny.statusChecking": "checking connection…",
    "kawanny.statusOnline": "AI connected",
    "kawanny.statusOffline": "offline mode (local answers)",
    "kawanny.greeting": "Hi! I'm Kawanny 👋 Ask me about Evertton, his projects, tech in general, or anything else — I'll do my best to actually answer, not just recite canned lines.",
    "kawanny.placeholder": "Type your question...",
    "kawanny.send": "Send",
    "kawanny.log": "Conversation with Kawanny",
    "kawanny.inputLabel": "Your question for Kawanny",
    "kawanny.suggestions": "Suggested questions",
    "kawanny.s1": "What projects has he built?",
    "kawanny.s2": "Which technologies does he use?",
    "kawanny.s3": "How can I contact him?",

    // contact
    "contact.copy": "Copy email",
    "contact.copied": "Email copied",
    "contact.title": "Contact",
    "contact.lede": "Send me a message — I'll reply here, by email, or on LinkedIn.",
    "contact.labelName": "Name",
    "contact.labelEmail": "Email",
    "contact.labelMessage": "Message",
    "contact.send": "Send message",
    "contact.success": "Message ready in your email app. If it did not open, copy the address above and write directly.",
    "contact.cardEmail": "Email",
    "contact.copyFailed": "Could not copy. Select the email and copy it manually.",
    "contact.err.name": "Please enter your name.",
    "contact.err.email": "Enter a valid email address.",
    "contact.err.message": "Please write a message.",
    "contact.errorSummary": "Please review the highlighted fields.",
    "contact.mailSubject": "Message from {name} via your portfolio",
    "contact.formLabel": "Contact form",

    // footer
    "footer.top": "Back to top",

    // viewer
    "viewer.label": "Image viewer",
    "viewer.close": "Close image",
    "viewer.prev": "Previous image",
    "viewer.next": "Next image",
    "viewer.zoom": "Enlarge image: {alt}",
  },

  es: {
    // meta
    "meta.title": "Evertton Thiago — Desarrollador Front-end",
    "meta.description": "Portafolio de Evertton Thiago, desarrollador front-end en transición hacia full stack. Proyectos, habilidades y certificados en HTML, CSS, JavaScript, React, Node.js y Python.",

    // a11y
    "a11y.skip": "Saltar al contenido principal",
    "a11y.newTab": "(se abre en una pestaña nueva)",

    // nav
    "nav.about": "Sobre mí",
    "nav.journey": "Trayectoria",
    "nav.skills": "Habilidades",
    "nav.projects": "Proyectos",
    "nav.certificates": "Certificados",
    "nav.kawanny": "Kawanny IA",
    "nav.contact": "Contacto",
    "nav.label": "Navegación principal",
    "nav.home": "Evertton Thiago — ir al inicio",
    "nav.menuOpen": "Abrir menú",
    "nav.menuClose": "Cerrar menú",

    // lang
    "lang.label": "Idioma",

    // theme
    "theme.toLight": "Cambiar al tema claro",
    "theme.toDark": "Cambiar al tema oscuro",

    // hero
    "hero.availability": "Disponible para proyectos, freelance y oportunidades de prácticas",
    "hero.lede": "Creo software que resuelve problemas reales y aporta valor desde el primer clic, con interfaces de alto rendimiento, accesibles y bien pensadas.",
    "hero.ctaProjects": "Ver proyectos",
    "hero.ctaContact": "Solicitar proyecto",
    "hero.role": "Desarrollador front-end en transición hacia full stack.",
    "hero.srRole": ", desarrollador front-end en transición hacia full stack",
    "hero.scrollCue": "Desplázate para ver los proyectos",

    // about
    "about.title": "Sobre mí",
    "about.lede": "Un poco de mi trayectoria hasta ahora.",
    "about.role": "Desarrollador Front-end",
    "about.p1": "Empecé en el desarrollo web con la intención de transformar la curiosidad en producto. Hoy invierto en proyectos reales, lógica, rendimiento y claridad de código para crear experiencias que entregan valor — no solo estética.",
    "about.p2": "Mi foco va más allá del front-end: evolucionar en arquitectura, lógica de negocio e integraciones para construir soluciones más consistentes, fáciles de mantener y más sólidas en el contexto real del usuario.",
    "about.p3": "También estoy ampliando mi inglés y español para colaborar con equipos y clientes de distintos lugares, además de consumir documentación técnica con mayor autonomía y velocidad.",
    "about.list1": "Enfoque en la experiencia real de uso, no solo en la apariencia visual",
    "about.list2": "Interfaces responsivas, con atención a rendimiento, accesibilidad y claridad de implementación",
    "about.list3": "Aprendizaje constante mediante proyectos prácticos, desafíos reales y código que se sostiene",
    "about.photoAlt": "Foto de Evertton Thiago",

    // skills
    "skills.title": "Habilidades",
    "skills.lede": "Herramientas y principios con los que construyo interfaces y sistemas con consistencia, claridad y enfoque en resultados.",
    "skills.t1": "Todos los días",
    "skills.t2": "Profundizando",
    "skills.t3": "Junto al código",
    "skills.resp": "Diseño responsivo",
    "skills.a11y": "Accesibilidad",
    "skills.projects": "Proyectos: {n}",
    "skills.studying": "Estudiando",
    "skills.certified": "Certificado",

    // journey
    "journey.title": "Mi evolución",
    "journey.lede": "Un camino construido con práctica, curiosidad y enfoque en entregar software que realmente funciona.",
    "journey.p1.period": "El comienzo",
    "journey.p1.title": "Primeros pasos hacia la ingeniería de software",
    "journey.p1.desc": "Empecé a convertir la curiosidad en práctica con HTML, CSS y JavaScript como base para entender cómo funciona la web en condiciones reales.",
    "journey.p2.period": "En la práctica",
    "journey.p2.title": "Construyendo interfaces que resuelven problemas reales",
    "journey.p2.desc": "Empecé a desarrollar herramientas y experiencias centradas en usabilidad, claridad y valor para quienes las usan.",
    "journey.p3.period": "Ahora",
    "journey.p3.title": "Ampliando la visión hacia el full stack",
    "journey.p3.desc": "Estoy profundizando en React, Node.js y Python para entender mejor cómo se construyen productos completos, desde la interfaz hasta la lógica que los sostiene.",
    "journey.p4.period": "Siguiente paso",
    "journey.p4.title": "Contribuir en equipos reales y seguir creciendo",
    "journey.p4.desc": "Busco una oportunidad para aprender en equipo, colaborar con enfoque y aportar valor desde los primeros desafíos.",

    // projects
    "projects.title": "Proyectos",
    "projects.lede": "Algunos trabajos que muestran cómo pienso, construyo y entrego interfaces con foco en valor real.",
    "projects.statusComplete": "Completado",
    "projects.statusProgress": "En desarrollo",
    "projects.p1.desc": "Herramienta con integración de IA para generar temas oscuros personalizados, combinando experiencia visual con automatización para acelerar la creación de interfaces más consistentes.",
    "projects.p2.desc": "Aplicación de delivery con enfoque mobile-first, pensando en flujo de compra rápido, navegación clara y usabilidad en pantallas pequeñas sin perder legibilidad ni velocidad.",
    "projects.p3.desc": "Conversor de monedas con interfaz clara y directa, desarrollado para ofrecer información rápida y una conversión simple entre distintas monedas.",
    "projects.linkGithub": "Ver en GitHub",
    "projects.p1.video": "Demostración en vídeo de Dark Generator",
    "projects.p2.video": "Demostración en vídeo de Delivery App Web",
    "projects.p2.image": "Mockup de Delivery App Web en escritorio, portátil, tableta y móvil",
    "projects.p3.image": "Interfaz de Dark Converter, un conversor de monedas",
    "projects.p2.mockupLink": "Ver mockup adaptable",

    // tag
    "tag.ia": "IA",
    "tag.responsive": "Responsivo",
    "tag.jsIa": "JS + IA",

    // certificates
    "certificates.title": "Certificados",
    "certificates.lede": "Formaciones que refuerzan la base, la disciplina y la capacidad de construir software con calidad.",
    "certificates.c1.title": "Formación DevClub HTML — Rodolfo Mori",
    "certificates.c1.desc": "Curso práctico enfocado en proyectos reales, buenas prácticas de desarrollo y creación de interfaces responsivas con calidad.",
    "certificates.c2.title": "Certificación CSS DevClub",
    "certificates.c2.desc": "Profundización en layout moderno, responsividad y animaciones con Flexbox, Grid y transiciones más refinadas.",
    "certificates.c3.title": "JavaScript, HTML y CSS con integración de IA",
    "certificates.c3.desc": "Desarrollo web enfocado en integrar inteligencia artificial para mejorar productividad, creatividad y calidad de entrega.",
    "certificates.c4.title": "Git & GitHub Masterclass",
    "certificates.c4.desc": "Control de versiones, colaboración en equipo, organización de ramas y commits con un workflow más profesional y escalable.",
    "certificates.issued2026": "Emitido en 2026",
    "certificates.added2026": "Añadido en 2026",
    "certificates.inProgress": "En curso",
    "certificates.next.title": "Próxima formación: back-end con Node.js",
    "certificates.next.desc": "Continuando el camino full stack — esta sección evoluciona a medida que se completan nuevas etapas y desafíos.",
    "certificates.c1.alt": "Certificado de finalización de la Formación DevClub HTML",
    "certificates.c2.alt": "Certificado de CSS Intermedio de DevClub",
    "certificates.c3.alt": "Certificado de JavaScript, HTML y CSS con integración de IA",
    "certificates.c4.alt": "Certificado de Git & GitHub Masterclass",

    // kawanny
    "kawanny.title": "Habla con Kawanny",
    "kawanny.lede": "Asistente de este portafolio. Pregunta sobre mis proyectos, habilidades o cualquier otra cosa.",
    "kawanny.statusChecking": "verificando conexión…",
    "kawanny.statusOnline": "IA conectada",
    "kawanny.statusOffline": "modo sin conexión (respuestas locales)",
    "kawanny.greeting": "¡Hola! Soy Kawanny 👋 Pregúntame sobre Evertton, sus proyectos, tecnología en general, o cualquier otra duda — haré lo posible por responder de verdad, no solo con frases predefinidas.",
    "kawanny.placeholder": "Escribe tu pregunta...",
    "kawanny.send": "Enviar",
    "kawanny.log": "Conversación con Kawanny",
    "kawanny.inputLabel": "Tu pregunta para Kawanny",
    "kawanny.suggestions": "Preguntas sugeridas",
    "kawanny.s1": "¿Qué proyectos ha hecho?",
    "kawanny.s2": "¿Qué tecnologías usa?",
    "kawanny.s3": "¿Cuál es su contacto?",

    // contact
    "contact.copy": "Copiar correo",
    "contact.copied": "Correo copiado",
    "contact.title": "Contacto",
    "contact.lede": "Envíame un mensaje — te respondo por aquí, email o LinkedIn.",
    "contact.labelName": "Nombre",
    "contact.labelEmail": "Email",
    "contact.labelMessage": "Mensaje",
    "contact.send": "Enviar mensaje",
    "contact.success": "Mensaje listo en tu app de correo. Si no se abrió, copia la dirección de arriba y escribe directamente.",
    "contact.cardEmail": "Email",
    "contact.copyFailed": "No se pudo copiar. Selecciona el correo y cópialo manualmente.",
    "contact.err.name": "Indica tu nombre.",
    "contact.err.email": "Introduce un correo válido.",
    "contact.err.message": "Escribe un mensaje.",
    "contact.errorSummary": "Revisa los campos resaltados.",
    "contact.mailSubject": "Mensaje de {name} desde tu portafolio",
    "contact.formLabel": "Formulario de contacto",

    // footer
    "footer.top": "Volver arriba",

    // viewer
    "viewer.label": "Visor de imágenes",
    "viewer.close": "Cerrar imagen",
    "viewer.prev": "Imagen anterior",
    "viewer.next": "Siguiente imagen",
    "viewer.zoom": "Ampliar imagen: {alt}",
  },

  ru: {
    // meta
    "meta.title": "Эвертон Тьяго — Frontend-разработчик",
    "meta.description": "Портфолио Эвертона Тьяго, frontend-разработчика, переходящего в full stack. Проекты, навыки и сертификаты по HTML, CSS, JavaScript, React, Node.js и Python.",

    // a11y
    "a11y.skip": "Перейти к основному содержимому",
    "a11y.newTab": "(откроется в новой вкладке)",

    // nav
    "nav.about": "Обо мне",
    "nav.journey": "Путь",
    "nav.skills": "Навыки",
    "nav.projects": "Проекты",
    "nav.certificates": "Сертификаты",
    "nav.kawanny": "ИИ Kawanny",
    "nav.contact": "Контакты",
    "nav.label": "Основная навигация",
    "nav.home": "Evertton Thiago — в начало",
    "nav.menuOpen": "Открыть меню",
    "nav.menuClose": "Закрыть меню",

    // lang
    "lang.label": "Язык",

    // theme
    "theme.toLight": "Включить светлую тему",
    "theme.toDark": "Включить тёмную тему",

    // hero
    "hero.availability": "Открыт для проектов, фриланса и стажировок",
    "hero.lede": "Создаю программное обеспечение, которое решает реальные задачи и приносит пользу с первого клика: быстрые, доступные и продуманные интерфейсы.",
    "hero.ctaProjects": "Смотреть проекты",
    "hero.ctaContact": "Заказать проект",
    "hero.role": "Front-end разработчик, переходящий в full stack.",
    "hero.srRole": ", front-end разработчик, переходящий в full stack",
    "hero.scrollCue": "Прокрутите, чтобы увидеть проекты",

    // about
    "about.title": "Обо мне",
    "about.lede": "Немного о моём пути.",
    "about.role": "Frontend-разработчик",
    "about.p1": "Я начал в веб-разработке с целью превратить любопытство в продукт. Сегодня я вкладываю время в реальные проекты, логику, производительность и ясность кода, чтобы создавать интерфейсы, которые приносят ценность — а не только визуальную привлекательность.",
    "about.p2": "Мой фокус выходит за рамки frontend: развиваться в архитектуре, бизнес-логике и интеграциях, чтобы создавать решения, которые более последовательны, проще поддерживаются и сильнее в реальном контексте пользователя.",
    "about.p3": "Я также учу английский и испанский, чтобы работать с командами и клиентами из разных стран и читать техническую документацию с большей автономией и скоростью.",
    "about.list1": "Фокус на реальном пользовательском опыте, а не только на визуальной оболочке",
    "about.list2": "Адаптивные интерфейсы с вниманием к производительности, доступности и качеству реализации",
    "about.list3": "Постоянное обучение через реальные проекты, задачи и код, который можно поддерживать",
    "about.photoAlt": "Фото Эвертона Тьяго",

    // skills
    "skills.title": "Навыки",
    "skills.lede": "Инструменты и принципы, на которых я строю интерфейсы и системы с последовательностью, ясностью и фокусом на результате.",
    "skills.t1": "Каждый день",
    "skills.t2": "Углубляю",
    "skills.t3": "Рядом с кодом",
    "skills.resp": "Адаптивная вёрстка",
    "skills.a11y": "Доступность",
    "skills.projects": "Проекты: {n}",
    "skills.studying": "Изучаю",
    "skills.certified": "Сертификат",

    // journey
    "journey.title": "Моё развитие",
    "journey.lede": "Путь, построенный на практике, любопытстве и фокусе на создании программного обеспечения, которое действительно работает.",
    "journey.p1.period": "Начало",
    "journey.p1.title": "Первые шаги к инженерии программного обеспечения",
    "journey.p1.desc": "Я начал превращать любопытство в практику, используя HTML, CSS и JavaScript, чтобы понять, как работает веб в реальных условиях.",
    "journey.p2.period": "Практика",
    "journey.p2.title": "Создание интерфейсов, которые решают реальные задачи",
    "journey.p2.desc": "Я начал разрабатывать инструменты и интерфейсы, ориентированные на удобство, ясность и ценность для конечного пользователя.",
    "journey.p3.period": "Сейчас",
    "journey.p3.title": "Расширяю взгляд до full stack",
    "journey.p3.desc": "Я углубляю знания React, Node.js и Python, чтобы лучше понимать, как строятся полноценные продукты — от интерфейса до логики, которая всё поддерживает.",
    "journey.p4.period": "Следующий шаг",
    "journey.p4.title": "Вносить вклад в реальные команды и продолжать расти",
    "journey.p4.desc": "Я ищу возможность учиться в команде, сотрудничать с фокусом и приносить пользу уже с первых задач.",

    // projects
    "projects.title": "Проекты",
    "projects.lede": "Несколько примеров того, как я думаю, создаю и доставляю интерфейсы с фокусом на реальную ценность.",
    "projects.statusComplete": "Завершён",
    "projects.statusProgress": "В разработке",
    "projects.p1.desc": "Инструмент с интеграцией ИИ для создания персонализированных тёмных тем, объединяющий визуальный опыт и автоматизацию для ускорения создания более согласованных интерфейсов.",
    "projects.p2.desc": "Приложение доставки с подходом mobile-first, ориентированное на быстрый процесс покупки, понятную навигацию и удобство на маленьких экранах без потери читаемости и скорости.",
    "projects.p3.desc": "Конвертер валют с понятным и прямым интерфейсом, созданный для быстрой выдачи информации и простого перевода между разными валютами.",
    "projects.linkGithub": "Смотреть на GitHub",
    "projects.p1.video": "Видеодемонстрация Dark Generator",
    "projects.p2.video": "Видеодемонстрация Delivery App Web",
    "projects.p2.image": "Макет Delivery App Web на десктопе, ноутбуке, планшете и телефоне",
    "projects.p3.image": "Интерфейс Dark Converter, конвертера валют",
    "projects.p2.mockupLink": "Смотреть адаптивный макет",

    // tag
    "tag.ia": "ИИ",
    "tag.responsive": "Адаптивный",
    "tag.jsIa": "JS + ИИ",

    // certificates
    "certificates.title": "Сертификаты",
    "certificates.lede": "Обучение, которое укрепляет базу, дисциплину и способность создавать качественное программное обеспечение.",
    "certificates.c1.title": "Курс DevClub HTML — Родолфо Мори",
    "certificates.c1.desc": "Практический курс с упором на реальные проекты, хорошие практики разработки и создание адаптивных интерфейсов с качеством.",
    "certificates.c2.title": "Сертификация DevClub CSS",
    "certificates.c2.desc": "Углубление в современную вёрстку, адаптивность и анимации с Flexbox, Grid и более плавными переходами.",
    "certificates.c3.title": "JavaScript, HTML и CSS с интеграцией ИИ",
    "certificates.c3.desc": "Веб-разработка с упором на интеграцию искусственного интеллекта для улучшения продуктивности, креативности и качества поставки.",
    "certificates.c4.title": "Git & GitHub Masterclass",
    "certificates.c4.desc": "Контроль версий, командная работа, организация веток и коммитов в более профессиональном и масштабируемом workflow.",
    "certificates.issued2026": "Выдан в 2026",
    "certificates.added2026": "Добавлен в 2026",
    "certificates.inProgress": "В процессе",
    "certificates.next.title": "Следующий этап: backend на Node.js",
    "certificates.next.desc": "Продолжаю путь full stack — этот раздел развивается по мере прохождения новых этапов и задач.",
    "certificates.c1.alt": "Сертификат о завершении программы DevClub HTML",
    "certificates.c2.alt": "Сертификат DevClub по CSS (средний уровень)",
    "certificates.c3.alt": "Сертификат по JavaScript, HTML и CSS с интеграцией ИИ",
    "certificates.c4.alt": "Сертификат Git & GitHub Masterclass",

    // kawanny
    "kawanny.title": "Поговорить с Kawanny",
    "kawanny.lede": "Ассистент этого портфолио. Спросите о моих проектах, навыках или о чём угодно ещё.",
    "kawanny.statusChecking": "проверка соединения…",
    "kawanny.statusOnline": "ИИ подключён",
    "kawanny.statusOffline": "офлайн-режим (локальные ответы)",
    "kawanny.greeting": "Привет! Я Kawanny 👋 Спросите меня об Эвертоне, его проектах, технологиях в целом или о чём угодно ещё — я постараюсь ответить по существу, а не просто готовыми фразами.",
    "kawanny.placeholder": "Введите ваш вопрос...",
    "kawanny.send": "Отправить",
    "kawanny.log": "Диалог с Kawanny",
    "kawanny.inputLabel": "Ваш вопрос для Kawanny",
    "kawanny.suggestions": "Предлагаемые вопросы",
    "kawanny.s1": "Какие проекты он сделал?",
    "kawanny.s2": "Какие технологии он использует?",
    "kawanny.s3": "Какие у него контакты?",

    // contact
    "contact.copy": "Скопировать почту",
    "contact.copied": "Почта скопирована",
    "contact.title": "Контакты",
    "contact.lede": "Напишите мне — отвечу здесь, по email или в LinkedIn.",
    "contact.labelName": "Имя",
    "contact.labelEmail": "Email",
    "contact.labelMessage": "Сообщение",
    "contact.send": "Отправить сообщение",
    "contact.success": "Сообщение подготовлено в вашей почтовой программе. Если она не открылась, скопируйте адрес выше и напишите напрямую.",
    "contact.cardEmail": "Email",
    "contact.copyFailed": "Не удалось скопировать. Выделите адрес и скопируйте вручную.",
    "contact.err.name": "Укажите ваше имя.",
    "contact.err.email": "Введите корректный email.",
    "contact.err.message": "Напишите сообщение.",
    "contact.errorSummary": "Проверьте выделенные поля.",
    "contact.mailSubject": "Сообщение от {name} через портфолио",
    "contact.formLabel": "Форма обратной связи",

    // footer
    "footer.top": "Наверх",

    // viewer
    "viewer.label": "Просмотр изображений",
    "viewer.close": "Закрыть изображение",
    "viewer.prev": "Предыдущее изображение",
    "viewer.next": "Следующее изображение",
    "viewer.zoom": "Увеличить изображение: {alt}",
  },
};
