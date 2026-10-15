# PORTFOLIO_IMPROVEMENT_LOG

Registro vivo do trabalho de evolução do portfólio. Última atualização: ciclo 1 (15/10/2026).

## 1. Objetivos
Transformar o portfólio existente numa experiência premium com **preto como identidade**, animações refinadas e acessíveis, responsividade real, projetos bem apresentados, código sustentável, performance e SEO verificáveis — **sem inventar nenhum dado** e preservando o que já funcionava (i18n em 4 idiomas, tema claro/escuro, Kawanny, visualizador, formulário).

## 2. Diagnóstico inicial (o que foi encontrado)

| Área | Problema | Evidência |
|---|---|---|
| Identidade | Fundo WebGL azul/violeta/rosa/laranja, gradientes e vidro (`backdrop-filter`) em dezenas de elementos, terminal de código como peça central | baseline visual; `bg.js` paletas coloridas |
| Conteúdo | "Ver demo" de **todos** os projetos apontava para o repositório do próprio portfólio; "Ver código" para o perfil | `index.html` original |
| Conteúdo | Hero dizia "full stack"; `<title>`, meta e Sobre diziam "front-end em transição" | `i18n.js` × `index.html` |
| Conteúdo | Faixa de estatísticas vaga ("8+ tecnologias em uso", incluindo o que está em estudo) | `stats.*` |
| Bug | Skip-link espiava ~6 px no topo da tela | captura do baseline |
| Bug | Chat enviava a mensagem atual duplicada ao backend | leitura de `scripts.js` + teste |
| Segurança | `api/chat.js` devolvia o corpo de erro da API ao navegador | leitura do código |
| Honestidade | Formulário dizia "cliente de e-mail aberto" mesmo quando nada abria | `contact.success` |
| Código | `styles.css` com 4 camadas de sobrescrita (v1→v4) e CSS morto (barras de progresso); `scripts.js` monolítico; fontes `Space Grotesk`/`Inter` referenciadas e nunca carregadas | leitura |
| Performance | `perfil.webp` 1400×1400 (214 KB) exibida a ~300 px; shader em tela cheia o tempo todo; imagens sem `width/height` | medição com `sharp` |
| A11y/i18n | Bandeiras emoji (não renderizam no Windows); `aria-label` fixos em PT; menu sem Esc/clique fora; chat sem `aria-live`; ordem do menu ≠ ordem das seções | revisão |
| Chat | Chave curta casava dentro de palavras ("git" em "digital") | leitura de `localAnswer` |
| Repo | 169 MB de originais (vídeos) publicados no deploy; `desktop.ini` rastreado | `du`, `git status` |

## 3. Melhorias concluídas (ciclo 1)

**Design e movimento**
- Novo sistema visual: preto neutro + 3 graus de grafite, uma cor de destaque discreta (`--accent`), tipografia Instrument Serif + Geist, hairlines em vez de sombras, raios pequenos (8/14/22 px).
- Hero: nome em escala editorial (revelação em máscara), papel + proposta de valor (conteúdo original reaproveitado), CTAs, stack real em duas colunas, "seda de luz" WebGL **monocromática** (renderiza só com o hero visível, adiada para ociosidade, 1 quadro estático em *reduced motion*).
- Fundo: grade de pontos revelada por uma luz que segue o ponteiro (só ponteiro fino) + grão estático (substitui filtro SVG).
- Vocabulário de movimento restrito: máscara que sobe, traço que se desenha, fade. Troca de tema com círculo de luz (View Transitions).
- Navegação: pílula flutuante, indicador deslizante, progresso, menu mobile como *disclosure* acessível.

**Conteúdo e estrutura (sem inventar nada)**
- Seções reordenadas para coincidir com o menu e priorizar evidência (Projetos → Sobre → Habilidades → Jornada → Certificados → Kawanny → Contato).
- Posicionamento unificado: "front-end em transição para full stack" em todo o site.
- Habilidades: barras/percentuais inexistentes; cada tecnologia mostra **dado verificável** (nº de projetos que a usam, "Certificado", "Em estudo").
- Projetos: links honestos (GitHub); mockup do Delivery virou link com miniatura (o vídeo estava sendo cortado ao meio).
- Faixa de estatísticas vaga removida.

**Engenharia**
- CSS único e organizado em 14 seções, sem código morto; JS em 11 módulos pequenos com falha isolada; i18n com paridade verificada; base da Kawanny carregada sob demanda.
- Correções: skip-link, histórico duplicado do chat, vazamento de erro em `api/chat.js` (+ timeout, validação, limpeza do mapa de rate limit, `ANTHROPIC_MODEL` configurável), "git" ≠ "digital", clique perdido no formulário (validação no blur deslocava o botão), revelação de itens que ficam *acima* da tela após rolagem que pula seções, aviso de "nova aba" para leitores de tela.
- Formulário com validação por campo, `aria-invalid`, foco no 1º erro e texto de sucesso honesto (mailto).

**Performance / SEO / infra**
- Variantes responsivas da foto (480/800) e miniaturas de certificados (640); `width/height` em todas as imagens; fontes reduzidas a 2 famílias.
- Favicon SVG + PNG + apple-touch, imagem OG 1200×630, `robots.txt`, JSON-LD corrigido, meta/OG sincronizados com o idioma, `vercel.json` (cabeçalhos de segurança, cache de assets), `.vercelignore` (deixa de publicar ~170 MB de originais).

## 4. Testes realizados e resultados

Ambiente: Chromium headless 141 (Playwright), **renderização por software (SwiftShader)**, **sem rede** → Google Fonts substituídas por *Liberation Serif/Sans* (métrica mais larga que as reais, logo conservadora). Comando: `node tests/qa.mjs`.

| Grupo | Resultado | O que cobre |
|---|---|---|
| i18n | 11/11 | paridade das 130 chaves em 4 idiomas, sem vazios, sem chaves mortas, placeholders idênticos |
| structure | 13/13 | ids únicos, âncoras, ARIA refs, 1 `<h1>`, hierarquia, `alt`, `width/height`, nomes acessíveis, labels, `rel`, arquivos referenciados existem, SEO básico, console limpo |
| overflow | 13/13 em PT, 13/13 em RU, 13/13 em EN | 320, 360, 390, 414, 600, 768, 820, 1024, 1100, 1280, 1440, 1920, 2560 px |
| motion | 6/6 | todos os itens recebem `.is-in` e terminam visíveis; *reduced motion*; **sem JavaScript** |
| a11y | 17/17 | skip-link, foco visível, tema, idioma, visualizador por teclado (setas/Esc/retorno do foco), menu mobile (Esc, clique fora, foco), alvos de toque ≥ 40 px |
| forms | 20/20 | validação, regressão do clique perdido, copiar e-mail, chat offline nos 4 idiomas, chat com backend simulado (histórico sem duplicar) |
| contrast | 26/26 | 13 pares × 2 temas ≥ 4,5:1 |
| perf | 3/3 asserções | CLS 0,000 (mobile 390); código do site sem long task > 200 ms (WebGL desligado); JS 82 KB |

Informativos (laboratório, **não** equivalem a Lighthouse): LCP 520–580 ms isolado (oscilou até ~4 s sob contenção de CPU na suíte completa); CSS 37 KB, HTML 37 KB, JS 82 KB (sem compressão; 42 KB são o dicionário dos 4 idiomas); imagens ~176 KB após rolar tudo (sem vídeos); com WebGL por software há uma tarefa longa de 100–500 ms na inicialização do shader (movida para ociosidade; em GPU real é uma fração).

Revisão visual manual por capturas: desktop 1440 (PT/RU, claro/escuro), tablet 768, mobile 390, RU a 1100, ultrawide 2560, menu aberto, visualizador, erros do formulário.

## 5. Nota por critério (0–10, interna)

| Critério | Nota | Status | Evidência / limite |
|---|---|---|---|
| Identidade visual | 8 | verificado visualmente | coerente em 2 temas; fontes reais não carregaram no sandbox |
| Impacto da 1ª impressão | 8 | verificado visualmente | subjetivo; depende das fontes reais |
| Animações | 8 | parcial | lógica e *reduced motion* testados; fluidez em aparelhos reais não medida |
| Conteúdo | 7 | verificado | dados reais preservados; faltam links reais dos projetos |
| Projetos | 7 | parcial | sem repo/demo reais nem "contribuição/resultado" (dados não fornecidos) |
| Navegação | 9 | verificado | scroll-spy, menu, âncoras, teclado |
| Responsividade | 9 | verificado (Chromium) | 13 larguras × 3 idiomas; sem aparelhos reais/Safari |
| Performance | 7 | parcial | CLS/long tasks/pesos medidos; **sem Lighthouse**, sem fontes reais, sem GPU real |
| Acessibilidade | 8 | parcial | checagens automáticas + teclado; **sem leitor de tela nem axe** |
| SEO | 6 | parcial | meta/OG/JSON-LD/robots ok; **sem domínio** → sem canonical/og:url/sitemap/OG absoluto |
| Código | 8 | verificado | modular, sem CSS morto, QA reproduzível |
| Funcionalidade | 8 | parcial | mailto não testável aqui; IA real não testada (sem chave) |
| Confiabilidade | 8 | verificado | 122 asserções verdes; build N/A (sem build) |
| Continuidade | 9 | verificado | este log + `NEXT_SESSION.md` + `CLAUDE.md` + QA |

## 6. Problemas conhecidos / limitações
- Links dos 3 projetos apontam para o perfil do GitHub (único dado real disponível).
- `og:image`/`twitter:image` são caminhos relativos (crawlers sociais exigem URL absoluta) — depende do domínio.
- Fontes vêm do Google Fonts (terceiro, 1 requisição bloqueante de CSS); não há *fallback* com métricas calibradas (`size-adjust`) porque as fontes reais não puderam ser medidas.
- Imagem OG foi gerada com *Lora* (fonte disponível no sandbox), não com a Instrument Serif.
- Poster do Dark Generator é um frame escuro e de baixo contraste.
- Formulário depende do app de e-mail do visitante (`mailto:`).
- Rate limit do chat é em memória (por instância serverless).
- Não testado: Safari/Firefox, aparelhos reais, leitor de tela, Lighthouse/axe, deploy na Vercel, `/api/chat` com chave real.
- `desktop.ini` (OneDrive) continua rastreado no git; o histórico git carrega ~200 MB de vídeos originais.

## 7. Próximas prioridades
Ver `NEXT_SESSION.md`.
