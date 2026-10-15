# Instruções do projeto (para o Claude Code e outras sessões)

Portfólio profissional de Evertton Thiago. Site **estático** (HTML/CSS/JS puros) + função serverless opcional `api/chat.js`.

## Antes de qualquer coisa
1. Leia `NEXT_SESSION.md` (estado e próximo passo) e `PORTFOLIO_IMPROVEMENT_LOG.md` (decisões e pendências).
2. Rode `git status` e inspecione o código real antes de continuar; não repita o que já está feito.

## Regras que não mudam
- **Nunca inventar** experiências, clientes, métricas, depoimentos, certificados, tecnologias, URLs ou domínios. Faltou dado → registre em `NEXT_SESSION.md`.
- **Sem build e sem ES modules**: scripts clássicos com `defer`, para o site continuar abrindo por duplo clique (`file://`). Novos módulos usam `Portfolio.register(nome, init)`.
- **Textos em 4 idiomas** (PT/EN/ES/RU): toda chave nova entra nos 4 em `js/i18n/dictionary.js`. O HTML traz o PT como padrão.
- **Identidade**: preto profundo + grafite; uma só cor de destaque (`--accent`); animar só `transform`/`opacity`/`clip-path`; tudo respeita `prefers-reduced-motion`; nada fica oculto sem JS.
- Sem novas dependências sem justificar benefício, peso e manutenção. Não executar ações destrutivas nem publicar/alterar configurações externas sem autorização.
- Nunca enfraquecer testes ou verificações para "passar".

## Comandos
- Servir: `npx serve .` (ou abrir `index.html`).
- QA completo: `node tests/qa.mjs` (ver README). Grupos: `QA_ONLY=i18n,structure,overflow,motion,a11y,forms,contrast,perf`.
- Regerar ativos derivados: `node tools/make-assets.mjs` (requer `sharp`).

## Ao terminar uma etapa
Atualize `PORTFOLIO_IMPROVEMENT_LOG.md` e `NEXT_SESSION.md`; deixe o projeto num estado que abre e passa no QA.
