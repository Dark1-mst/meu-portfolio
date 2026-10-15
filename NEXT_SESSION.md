# NEXT_SESSION

## Estado atual
Ciclo 1 concluído e publicado no GitHub (`main`, commit `5f2d676`): redesign completo (preto/grafite), arquitetura em módulos e correções de bugs. O QA automatizado registrado abaixo passou (122 asserções). Nesta sessão, uma nova execução ficou mais de três minutos sem resultado e foi interrompida; ela não constitui uma nova validação. O push incluiu o commit local anterior e as alterações pendentes do projeto; `portfolio-evoluido.patch` ficou fora do GitHub.

Arquivos principais: `index.html`, `css/styles.css`, `js/*.js`, `js/i18n/dictionary.js`, `api/chat.js`, `tests/qa.mjs`, `tools/make-assets.mjs`.
Arquivos removidos (substituídos; recuperáveis pelo git): `styles.css`, `scripts.js`, `bg.js`, `i18n.js` da raiz.

## Precisa de você (dados que não posso inventar)
1. **URLs reais** do repositório e da demo ao vivo de cada projeto (Dark Generator, Delivery App Web, Dark Converter). Hoje todos apontam para `github.com/Dark1-mst`.
2. **Sua contribuição / resultados reais** por projeto, se quiser mostrá-los (problema, decisões técnicas, resultado comprovado).
3. **Domínio de produção** (para `canonical`, `og:url`, `og:image` absoluta, sitemap).
4. Decidir se quer **receber mensagens do formulário** direto (Formspree/Resend) em vez de `mailto:`.

## Próximo passo concreto (ordem sugerida)
1. Com o domínio: em `index.html`, trocar `og:image`/`twitter:image` por URL absoluta, adicionar `<link rel="canonical">` e `og:url`; acrescentar `url`/`image` no JSON-LD; completar `robots.txt`.
2. Hospedar as fontes localmente (Geist e Instrument Serif, `.woff2`, só os pesos usados) e calibrar uma fonte de reserva com `size-adjust`/`ascent-override` para zerar o salto de fonte; **remedir** CLS/LCP.
3. Em ambiente com rede e GPU: Lighthouse (mobile) e axe; testar Safari (iOS: `<dialog>`, `100svh`, View Transitions) e Firefox; testar com leitor de tela (NVDA/VoiceOver).
4. Fazer deploy de preview na Vercel; configurar `ANTHROPIC_API_KEY`; testar `/api/chat` de verdade (hoje só testado com backend simulado).
5. Regerar a imagem OG com a fonte real (`node tools/make-assets.mjs`, ajustando a fonte no SVG) e trocar o poster do Dark Generator por um frame de maior contraste.
6. Opcional: CSP com hashes (JSON-LD e script do tema são inline), rate limit em KV externo, remover `desktop.ini` do git e limpar o histórico dos vídeos originais (`fotos do port/`).

## Testes já realizados
`node tests/qa.mjs` — i18n 11/11, structure 13/13, overflow 13/13 × (PT, RU, EN), motion 6/6, a11y 17/17, forms 20/20, contrast 26/26, perf 3/3. Ambiente: Chromium headless, GL por software, sem rede (fontes substitutas). Detalhes e limites em `PORTFOLIO_IMPROVEMENT_LOG.md` §4–§6.

## Como retomar
1. Ler `CLAUDE.md`, este arquivo e o log.
2. `git status`; servir com `npx serve .`; rodar `node tests/qa.mjs` para confirmar o ponto de partida.
3. Aplicar o próximo passo, rodar o QA, atualizar log e este arquivo.
