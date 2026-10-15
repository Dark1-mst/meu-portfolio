# Portfólio — Evertton Thiago

Site estático (HTML + CSS + JavaScript puros, sem build) com uma função serverless opcional para a assistente **Kawanny**. Identidade: preto profundo e grafite, tipografia serifada de destaque (Instrument Serif) + Geist, luz como único elemento decorativo.

## Como rodar

- **Mais simples:** dê duplo clique em `index.html`. Funciona via `file://` porque os scripts são clássicos (sem ES modules). Nesse modo a Kawanny responde em modo local (sem IA).
- **Servidor local (recomendado para testar tudo):** `npx serve .` ou a extensão *Live Server* do VS Code.
- **Com a IA da Kawanny:** `npx vercel dev` (precisa da variável `ANTHROPIC_API_KEY`, veja abaixo).

## Estrutura

```
index.html               marcação semântica; PT é o idioma padrão (data-i18n="chave")
css/styles.css           uma folha só: tokens → base → componentes → seções → movimento → responsivo
js/
  core.js                namespace Portfolio, utilitários, registro de módulos (falha isolada)
  theme.js               tema escuro/claro (+ View Transitions)
  language.js            troca de idioma PT/EN/ES/RU
  nav.js                 menu mobile, item ativo, indicador deslizante, progresso
  motion.js              revelações por rolagem, luz do ponteiro, 1 vídeo por vez
  background.js          "seda de luz" WebGL (só no hero, só quando visível)
  lightbox.js            visualizador de imagens (<dialog>)
  contact.js             copiar e-mail + formulário (mailto:)
  chat.js                Kawanny (IA via /api/chat, com reserva local)
  main.js                inicia tudo
  i18n/dictionary.js     textos da interface nos 4 idiomas
  i18n/knowledge.js      base local da Kawanny (carregada só quando necessária)
api/chat.js              função serverless (Vercel) que fala com a API da Anthropic
assets/                  imagens, vídeos, ícones (derivados gerados por tools/make-assets.mjs)
tools/make-assets.mjs    regera favicon, ruído, imagem de compartilhamento e variantes responsivas
tests/qa.mjs             suíte de QA automatizada (Playwright)
```

## Editar conteúdo

- **Textos:** estão no HTML (PT) e em `js/i18n/dictionary.js` (4 idiomas). Para mudar um texto, altere **a chave nos 4 idiomas** — o QA verifica a paridade e chaves mortas.
- **Novo projeto:** copie um `<article class="project">` em `index.html` e crie as chaves `projects.pN.*` no dicionário.
- **Links dos projetos:** hoje todos apontam para o perfil `github.com/Dark1-mst` (o link "Ver demo" antigo apontava para o repositório do próprio portfólio e foi removido). Troque pelo repositório/demo reais assim que existirem.
- **Cor de destaque, espaçamentos, tipografia:** tokens no topo de `css/styles.css` (`:root` e `[data-theme="light"]`).

## Kawanny com IA (Vercel)

1. Vercel → *Project Settings → Environment Variables* → `ANTHROPIC_API_KEY`.
2. (Opcional) `ANTHROPIC_MODEL` para trocar o modelo (padrão: o que já estava em uso).
3. Redeploy. O site detecta sozinho (`GET /api/chat` → `{ ai: true }`); sem chave, usa a base local.

A chave nunca vai para o navegador. Há limite de 12 mensagens/min por IP (em memória, por instância) e o texto de erro da API **não** é repassado ao visitante.

## Formulário de contato

O site é estático: o formulário valida e **abre o app de e-mail** do visitante (`mailto:`). A mensagem não passa por servidor. Para receber mensagens direto na caixa de entrada, integre um serviço (Formspree, Resend etc.) — exige uma conta/chave sua, por isso não foi feito automaticamente.

## QA

```bash
npm i --no-save playwright && npx playwright install chromium
node tests/qa.mjs                    # tudo
QA_ONLY=forms node tests/qa.mjs      # grupos: i18n, structure, overflow, motion, a11y, forms, contrast, perf
QA_LANGS=ru QA_ONLY=overflow node tests/qa.mjs
```

Cobre: paridade i18n, estrutura/ARIA/links/SEO, overflow em 13 larguras, revelações e *reduced motion*, teclado/menu/visualizador, formulário, chat (incluindo backend simulado), contraste dos tokens (AA) e CLS/long tasks.

## Deploy

`vercel.json` define cabeçalhos de segurança e cache de `assets/`. `.vercelignore` impede a publicação de `fotos do port/` (169 MB de originais), `certificados/`, `tools/`, `tests/` e docs.

## Acessibilidade e movimento

`prefers-reduced-motion` desliga entradas, revelações, seda de luz (fica um quadro estático) e rolagem suave. Sem JavaScript, todo o conteúdo continua visível (em PT). Contraste dos tokens verificado ≥ 4,5:1 nos dois temas.

Histórico de decisões, pendências e próximos passos: `PORTFOLIO_IMPROVEMENT_LOG.md` e `NEXT_SESSION.md`.
