# Portfólio — Evertton Thiago

## Estrutura
- `index.html`, `styles.css`, `scripts.js` — o site.
- `api/chat.js` — função serverless que conecta a Kawanny a uma IA real (Claude).
- `fotos do port/`, `certificados/`, `1774829199175.webp` — suas imagens e vídeos originais.

## Como publicar na Vercel (grátis)
1. Suba esta pasta para um repositório no GitHub.
2. Entre em [vercel.com](https://vercel.com), clique em **Add New → Project** e selecione o repositório.
3. Não precisa mudar nenhuma configuração de build — é um site estático com uma função serverless, a Vercel detecta sozinha.
4. Antes (ou depois) do primeiro deploy, vá em **Project Settings → Environment Variables** e adicione:
   - `ANTHROPIC_API_KEY` = sua chave da API da Anthropic (console.anthropic.com)
5. Clique em **Deploy**. Pronto — a Kawanny já responde qualquer pergunta usando IA real.

Se você não configurar a `ANTHROPIC_API_KEY`, o site continua funcionando normalmente:
a Kawanny detecta que o backend não está disponível e usa automaticamente o modo de
respostas locais (mais limitado, mas sempre funcional).

## Itens para você personalizar
- **Links dos projetos**: em `index.html`, procure por `href="#"` dentro de `.project-links`
  e troque pelos links reais do GitHub e das demos de cada projeto.
- **Formulário de contato**: hoje ele só valida os campos e reseta (não envia e-mail de
  verdade). Para receber as mensagens, conecte a um serviço como
  [Formspree](https://formspree.io) ou [EmailJS](https://www.emailjs.com), ou crie outra
  função em `api/` que envie o e-mail — o comentário no `scripts.js` marca onde mexer.

## Rodando localmente
Como é HTML/CSS/JS puro, basta abrir `index.html` no navegador para ver o layout.
A função `api/chat.js` só funciona quando publicada na Vercel (ou rodando com
`vercel dev`), porque depende do ambiente serverless.
