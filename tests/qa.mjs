/* ==========================================================================
   tests/qa.mjs — verificação automatizada do portfólio (Chromium headless)
   Uso:   npm i --no-save playwright && npx playwright install chromium
          node tests/qa.mjs
   Variáveis opcionais:
          QA_OFFLINE_FONTS=1   substitui as Google Fonts por fontes locais (sandbox sem rede)
          QA_ONLY=overflow,a11y   roda só alguns grupos
   Sobe um servidor estático próprio (porta livre) — não precisa de nada além do Node.
   Sai com código 1 se algum teste falhar.
   ========================================================================== */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ONLY = process.env.QA_ONLY ? process.env.QA_ONLY.split(',') : null;
const want = (group) => !ONLY || ONLY.includes(group);

/* ---------------------------------------------------------------- servidor */
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.txt': 'text/plain', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/api/chat') { // simula a Vercel sem chave de IA
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, ai: false }));
  }
  const file = path.join(ROOT, url === '/' ? 'index.html' : url);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Content-Length': fs.statSync(file).size });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}/index.html`;

/* ---------------------------------------------------------------- resultados */
const results = [];
const check = (group, name, ok, detail = '') => results.push({ group, name, ok: Boolean(ok), detail });
const warn = (group, name, detail) => results.push({ group, name, ok: true, warn: true, detail });

const FONT_CSS = `@font-face{font-family:'Instrument Serif';src:local('Liberation Serif')}@font-face{font-family:'Geist';font-weight:100 900;src:local('Liberation Sans')}`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

async function open({ w = 1440, h = 900, lang = 'pt', theme = 'dark', reducedMotion = false, js = true, wait = 1800, init } = {}) {
  const mobile = w < 700;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: mobile, isMobile: mobile, javaScriptEnabled: js, reducedMotion: reducedMotion ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/ERR_NAME_NOT_RESOLVED|fonts\.(googleapis|gstatic)/.test(m.text())) logs.push(m.text()); });
  page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
  if (process.env.QA_OFFLINE_FONTS) {
    await page.route(/fonts\.googleapis\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: FONT_CSS }));
    await page.route(/fonts\.gstatic\.com/, (r) => r.abort());
  } else {
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  }
  await page.addInitScript(([l, t]) => { try { localStorage.setItem('lang', l); localStorage.setItem('theme', t); } catch (e) { } }, [lang, theme]);
  if (init) await init(page);
  await page.goto(BASE, { waitUntil: 'load' });
  if (wait) await page.waitForTimeout(wait);
  return { ctx, page, logs };
}
const scrollThrough = async (page) => {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= total; y += 450) { await page.evaluate((yy) => scrollTo({ top: yy, behavior: 'instant' }), y); await page.waitForTimeout(90); }
  await page.waitForTimeout(1500);
};

/* ============================================================ 1. i18n (estático) */
if (want('i18n')) {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const dictSrc = fs.readFileSync(path.join(ROOT, 'js/i18n/dictionary.js'), 'utf8');
  const I18N = new Function('window', dictSrc + '; return window.I18N;')({});
  const langs = ['pt', 'en', 'es', 'ru'];
  const used = new Set();
  for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) used.add(m[1]);
  for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) m[1].split(';').forEach((p) => used.add(p.split(':')[1]));
  const jsSrc = fs.readdirSync(path.join(ROOT, 'js')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(ROOT, 'js', f), 'utf8')).join('\n');
  for (const m of jsSrc.matchAll(/P\.t\('([^']+)'/g)) used.add(m[1]);
  for (const m of jsSrc.matchAll(/'([a-z0-9]+\.[\w.]+)'/gi)) if (m[1] in I18N.pt) used.add(m[1]);

  const base = Object.keys(I18N.pt);
  for (const l of langs) {
    const keys = Object.keys(I18N[l]);
    check('i18n', `paridade de chaves ${l} = pt`, keys.length === base.length && base.every((k) => k in I18N[l]), `${keys.length}/${base.length}`);
    check('i18n', `nenhum texto vazio em ${l}`, keys.every((k) => String(I18N[l][k]).trim().length > 0));
  }
  const missing = [...used].filter((k) => !(k in I18N.pt));
  check('i18n', 'toda chave usada no HTML/JS existe no dicionário', missing.length === 0, missing.join(', '));
  const unused = base.filter((k) => !used.has(k));
  check('i18n', 'nenhuma chave morta no dicionário', unused.length === 0, unused.join(', '));
  const withVars = base.filter((k) => /\{\w+\}/.test(I18N.pt[k]));
  check('i18n', 'placeholders {x} idênticos em todos os idiomas', withVars.every((k) => langs.every((l) => (I18N[l][k].match(/\{\w+\}/g) || []).sort().join() === (I18N.pt[k].match(/\{\w+\}/g) || []).sort().join())), withVars.join(', '));
}

/* ============================================================ 2. Estrutura / links / SEO */
if (want('structure')) {
  const { page, ctx, logs } = await open();
  const r = await page.evaluate(async () => {
    const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    const anchors = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href').slice(1)).filter(Boolean);
    const brokenAnchors = anchors.filter((id) => !document.getElementById(id));
    const refs = [...document.querySelectorAll('[aria-controls],[aria-describedby],[aria-labelledby],label[for]')].flatMap((e) => ['aria-controls', 'aria-describedby', 'aria-labelledby', 'for'].map((a) => e.getAttribute(a)).filter(Boolean).flatMap((v) => v.split(' ')));
    const brokenRefs = refs.filter((id) => !document.getElementById(id));
    const heads = [...document.querySelectorAll('h1,h2,h3')].map((h) => +h.tagName[1]);
    let jump = false; for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) jump = true;
    const noAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;
    const noDims = [...document.querySelectorAll('img:not(.viewer-image)')].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length;
    const unnamed = [...document.querySelectorAll('button,a[href],select')].filter((e) => !(e.getAttribute('aria-label') || e.textContent.trim() || e.querySelector('img[alt]:not([alt=""])') || e.closest('label')?.textContent.trim())).map((e) => e.outerHTML.slice(0, 80));
    const unlabeled = [...document.querySelectorAll('input,textarea,select')].filter((e) => !(document.querySelector(`label[for="${e.id}"]`) || e.closest('label'))).map((e) => e.id);
    const externalNoRel = [...document.querySelectorAll('a[target=_blank]')].filter((a) => !/noopener/.test(a.rel)).length;
    const h1 = document.querySelectorAll('h1').length;
    const metas = { desc: document.querySelector('meta[name=description]')?.content.length, og: !!document.querySelector('meta[property="og:title"]'), icon: !!document.querySelector('link[rel=icon]'), title: document.title.length, lang: document.documentElement.lang };
    // arquivos locais referenciados existem?
    const local = [...document.querySelectorAll('[src],link[href],[data-full],[poster]')].flatMap((e) => ['src', 'href', 'data-full', 'poster'].map((a) => e.getAttribute(a)).filter(Boolean)).filter((u) => !/^(https?:|#|mailto:|data:)/.test(u));
    const srcset = [...document.querySelectorAll('[srcset]')].flatMap((e) => e.getAttribute('srcset').split(',').map((s) => s.trim().split(' ')[0]));
    const missing = [];
    for (const u of [...new Set([...local, ...srcset])]) { const res = await fetch(u.split('?')[0]); if (!res.ok) missing.push(u); }
    return { dup, brokenAnchors, brokenRefs, jump, noAlt, noDims, unnamed, unlabeled, externalNoRel, h1, metas, missing };
  });
  check('structure', 'ids únicos', r.dup.length === 0, r.dup.join());
  check('structure', 'âncoras internas apontam para ids existentes', r.brokenAnchors.length === 0, r.brokenAnchors.join());
  check('structure', 'aria-controls/labelledby/describedby/for válidos', r.brokenRefs.length === 0, r.brokenRefs.join());
  check('structure', 'exatamente um <h1>', r.h1 === 1, String(r.h1));
  check('structure', 'hierarquia de títulos sem saltos', !r.jump);
  check('structure', 'todas as <img> têm alt', r.noAlt === 0);
  check('structure', 'todas as <img> têm width/height (sem CLS)', r.noDims === 0);
  check('structure', 'botões/links/selects com nome acessível', r.unnamed.length === 0, r.unnamed.join(' | '));
  check('structure', 'campos de formulário com label', r.unlabeled.length === 0, r.unlabeled.join());
  check('structure', 'links externos com rel="noopener"', r.externalNoRel === 0);
  check('structure', 'arquivos locais referenciados existem (src/href/srcset/poster)', r.missing.length === 0, r.missing.join());
  check('structure', 'SEO: title, description (50–180), og:title, favicon, lang', r.metas.title > 10 && r.metas.desc >= 50 && r.metas.desc <= 180 && r.metas.og && r.metas.icon && r.metas.lang === 'pt-BR', JSON.stringify(r.metas));
  check('structure', 'sem erros/avisos no console ao carregar', logs.length === 0, logs.join(' | '));
  await ctx.close();
}

/* ============================================================ 3. Overflow horizontal em várias larguras/idiomas */
if (want('overflow')) {
  const widths = [320, 360, 390, 414, 600, 768, 820, 1024, 1100, 1280, 1440, 1920, 2560];
  for (const lang of (process.env.QA_LANGS || 'pt,ru').split(',')) {
    for (const w of widths) {
      const { page, ctx } = await open({ w, h: w < 700 ? 800 : 900, lang, wait: 900 });
      await scrollThrough(page);
      const bad = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const out = [];
        document.querySelectorAll('body *').forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || el.closest('.sr-only,.skip-link,.viewer,.nav-links:not(.is-open),.backdrop,.hero-silk,canvas')) return;
          if (el.classList.contains('sr-only')) return;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          if (r.right > vw + 1.5 || r.left < -1.5) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} (${Math.round(r.left)}→${Math.round(r.right)} / ${vw})`);
        });
        return { out: out.slice(0, 5), doc: document.documentElement.scrollWidth > vw + 1 };
      });
      check('overflow', `${lang} @${w}px sem overflow horizontal`, !bad.doc && bad.out.length === 0, bad.out.join(' ; '));
      await ctx.close();
    }
  }
}

/* ============================================================ 4. Revelações, sem-JS, movimento reduzido */
if (want('motion')) {
  const SEL = '.reveal-title,.section-lede,.project,.about-copy,.portrait,.tier,.timeline,.step,.cert,.chat,.mail-cta,.contact-form,.contact-links';
  // espera as transições convergirem (em máquinas lentas o 1º recálculo de estilo atrasa) e devolve o que sobrou oculto
  const hidden = async (page, timeout = 8000) => {
    const probe = () => page.evaluate((sel) => [...document.querySelectorAll(sel + ',.mask-in,.project-media')].filter((el) => {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.99) return true;
      if (el.classList.contains('mask-in')) return cs.transform !== 'none' && cs.transform !== 'matrix(1, 0, 0, 1, 0, 0)';
      if (el.classList.contains('project-media')) return /100%/.test(cs.clipPath);
      return false;
    }).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]}`), SEL);
    const start = Date.now(); let left = await probe();
    while (left.length && Date.now() - start < timeout) { await page.waitForTimeout(400); left = await probe(); }
    return left;
  };

  let s = await open();
  await scrollThrough(s.page);
  const notIn = await s.page.evaluate((sel) => [...document.querySelectorAll(sel)].filter((e) => !e.classList.contains('is-in')).map((e) => e.className.split(' ')[0]), SEL);
  check('motion', 'após rolar a página, todos os elementos observados receberam .is-in', notIn.length === 0, notIn.join(', '));
  let h = await hidden(s.page);
  check('motion', 'e todos terminam visíveis (opacity 1, sem clip, sem deslocamento)', h.length === 0, [...new Set(h)].join(', '));
  check('motion', 'hero revelado (nome visível)', await s.page.evaluate(() => { const l = document.querySelector('.hero-name .line-inner'); return getComputedStyle(l).transform === 'none' || getComputedStyle(l).transform === 'matrix(1, 0, 0, 1, 0, 0)'; }));
  await s.ctx.close();

  s = await open({ reducedMotion: true });
  h = await hidden(s.page);
  check('motion', 'prefers-reduced-motion: tudo visível sem rolar', h.length === 0, [...new Set(h)].join(', '));
  const dur = await s.page.evaluate(() => getComputedStyle(document.querySelector('.hero-name .line-inner')).animationName);
  check('motion', 'prefers-reduced-motion: sem animação de entrada do hero', dur === 'none', dur);
  await s.ctx.close();

  s = await open({ js: false, wait: 2500 });
  h = await hidden(s.page);
  const nameVisible = await s.page.evaluate(() => { const r = document.querySelector('.hero-name').getBoundingClientRect(); return r.height > 100; });
  check('motion', 'sem JavaScript: conteúdo continua visível', h.length === 0 && nameVisible, [...new Set(h)].join(', '));
  await s.ctx.close();
}

/* ============================================================ 5. Teclado, menu, visualizador, tema, idioma */
if (want('a11y')) {
  let { page, ctx } = await open({ w: 1440 });
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); return { cls: a.className, top: r.top, bottom: r.bottom }; });
  check('a11y', 'primeiro Tab foca o skip-link e ele fica visível', skip.cls.includes('skip-link') && skip.top >= 0 && skip.bottom > 0, JSON.stringify(skip));
  await page.keyboard.press('Enter');
  check('a11y', 'skip-link leva o foco ao <main>', await page.evaluate(() => document.activeElement.id === 'main-content'));
  const skipHidden = await open({ wait: 500 });
  const peek = await skipHidden.page.evaluate(() => document.querySelector('.skip-link').getBoundingClientRect().bottom);
  check('a11y', 'skip-link totalmente fora da tela quando sem foco (bug original: espiava 6px)', peek <= 0, String(peek));
  await skipHidden.ctx.close();

  // foco visível em elementos interativos
  const focusRing = await page.evaluate(async () => {
    const targets = ['.nav-link', '.btn-primary', '.btn-ghost', '#theme-toggle', '.link', '.zoom', '.suggestion', '.contact-card', '#name'];
    const bad = [];
    for (const sel of targets) {
      const el = document.querySelector(sel); if (!el) { bad.push(sel + ' (inexistente)'); continue; }
      el.focus({ preventScroll: true });
      const cs = getComputedStyle(el);
      const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2) || cs.boxShadow !== 'none';
      if (!ring) bad.push(sel);
    }
    return bad;
  });
  check('a11y', 'foco visível (outline ≥2px ou ring) nos elementos interativos', focusRing.length === 0, focusRing.join(', '));

  // tema
  await page.click('#theme-toggle'); await page.waitForFunction(() => document.documentElement.dataset.theme === 'light', null, { timeout: 5000 }).catch(() => { });
  check('a11y', 'tema claro aplicado e persistido', await page.evaluate(() => document.documentElement.dataset.theme === 'light' && localStorage.getItem('theme') === 'light'));
  check('a11y', 'aria-label do botão de tema reflete o estado', await page.evaluate(() => /escuro/i.test(document.getElementById('theme-toggle').getAttribute('aria-label'))));
  await page.click('#theme-toggle'); await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark', null, { timeout: 5000 }).catch(() => { });

  // idioma
  await page.selectOption('#lang-select', 'en'); await page.waitForTimeout(300);
  const en = await page.evaluate(() => ({ lang: document.documentElement.lang, title: document.title, h2: document.querySelector('#projects-title').textContent, nav: document.querySelector('.nav-link').textContent, alt: document.querySelector('.portrait img').alt, stored: localStorage.getItem('lang'), skillMeta: document.querySelector('.skill-meta').textContent }));
  check('a11y', 'troca para EN: <html lang>, title, títulos, alt, {n} e persistência', en.lang === 'en' && /Front-end Developer/.test(en.title) && en.h2 === 'Projects' && en.nav === 'Projects' && /Photo/.test(en.alt) && en.stored === 'en' && en.skillMeta === 'Projects: 3', JSON.stringify(en));
  await page.selectOption('#lang-select', 'pt'); await page.waitForTimeout(300);
  check('a11y', 'volta para PT restaura os textos', await page.evaluate(() => document.querySelector('#projects-title').textContent === 'Projetos' && document.querySelector('.skill-meta').textContent === 'Projetos: 3'));

  // visualizador
  await page.evaluate(() => scrollTo({ top: document.querySelector('#certificates').offsetTop, behavior: 'instant' })); await page.waitForTimeout(500);
  await page.focus('.cert .zoom'); await page.keyboard.press('Enter'); await page.waitForTimeout(500);
  const v1 = await page.evaluate(() => ({ open: document.getElementById('viewer').open, count: document.querySelector('.viewer-count').textContent, src: document.querySelector('.viewer-image').getAttribute('src') }));
  check('a11y', 'visualizador abre por teclado com imagem e contador', v1.open && /\d+ \/ \d+/.test(v1.count) && /cert-/.test(v1.src), JSON.stringify(v1));
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(150);
  const c2 = await page.evaluate(() => document.querySelector('.viewer-count').textContent);
  check('a11y', 'seta → avança a imagem', c2 !== v1.count, `${v1.count} → ${c2}`);
  await page.keyboard.press('Escape');
  const closedOk = await page.waitForFunction(() => !document.getElementById('viewer').open && document.activeElement.classList.contains('zoom') && !document.documentElement.classList.contains('is-locked'), null, { timeout: 5000 }).then(() => true, () => false);
  check('a11y', 'Esc fecha o visualizador, devolve o foco e destrava a rolagem', closedOk);
  await ctx.close();

  // menu mobile
  ({ page, ctx } = await open({ w: 390, h: 844 }));
  check('a11y', 'mobile: menu começa fechado e links ficam fora da ordem de tab', await page.evaluate(() => getComputedStyle(document.getElementById('nav-links')).visibility === 'hidden' && document.getElementById('nav-toggle').getAttribute('aria-expanded') === 'false'));
  await page.tap('#nav-toggle'); await page.waitForTimeout(600);
  const m1 = await page.evaluate(() => ({ exp: document.getElementById('nav-toggle').getAttribute('aria-expanded'), focus: document.activeElement.className, label: document.getElementById('nav-toggle').getAttribute('aria-label'), vis: getComputedStyle(document.getElementById('nav-links')).visibility }));
  check('a11y', 'mobile: abrir menu → aria-expanded, foco no 1º link, rótulo "Fechar"', m1.exp === 'true' && m1.focus.includes('nav-link') && /Fechar/.test(m1.label) && m1.vis === 'visible', JSON.stringify(m1));
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  check('a11y', 'mobile: Esc fecha o menu e devolve o foco ao botão', await page.evaluate(() => document.getElementById('nav-toggle').getAttribute('aria-expanded') === 'false' && document.activeElement.id === 'nav-toggle'));
  await page.tap('#nav-toggle'); await page.waitForTimeout(500);
  await page.tap('.nav-link[href="#skills"]'); await page.waitForTimeout(1500);
  check('a11y', 'mobile: tocar num link fecha o menu e rola até a seção', await page.evaluate(() => document.getElementById('nav-toggle').getAttribute('aria-expanded') === 'false' && Math.abs(document.getElementById('skills').getBoundingClientRect().top) < 140));
  await page.tap('#nav-toggle'); await page.waitForTimeout(400);
  await page.mouse.click(200, 700); await page.waitForTimeout(400);
  check('a11y', 'mobile: toque fora fecha o menu', await page.evaluate(() => document.getElementById('nav-toggle').getAttribute('aria-expanded') === 'false'));

  // alvos de toque
  const small = await page.evaluate(() => [...document.querySelectorAll('button, select, input, textarea, .btn, .nav-link, .suggestion, .contact-card, .icon-btn')].filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && cs.visibility !== 'hidden' && !e.closest('.nav-links:not(.is-open)') && !e.closest('.viewer') && (r.height < 40 || r.width < 40); }).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0] || e.id} ${Math.round(e.getBoundingClientRect().width)}×${Math.round(e.getBoundingClientRect().height)}`));
  check('a11y', 'mobile: alvos de toque ≥ 40px (botões, campos, menu)', small.length === 0, small.join(', '));
  await ctx.close();
}

/* ============================================================ 6. Formulário, copiar e-mail, chat */
if (want('forms')) {
  let { page, ctx, logs } = await open({ w: 1440 });
  await page.evaluate(() => document.getElementById('contact').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(600);
  await page.click('#contact-form button[type=submit]'); await page.waitForTimeout(200);
  const e1 = await page.evaluate(() => ({ inv: [...document.querySelectorAll('[aria-invalid=true]')].map((e) => e.id), errs: [...document.querySelectorAll('.field-error')].map((e) => e.textContent), note: document.getElementById('form-note').dataset.state, focus: document.activeElement.id }));
  check('forms', 'envio vazio: 3 campos inválidos, mensagens, nota de erro e foco no 1º', e1.inv.length === 3 && e1.errs.every(Boolean) && e1.note === 'error' && e1.focus === 'name', JSON.stringify(e1));
  // regressão: digitar e-mail inválido e clicar direto em "Enviar" (o blur não pode deslocar o botão)
  await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(800);
  await page.evaluate(() => document.getElementById('contact').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(1500);
  await page.fill('#email', 'ana@@x');
  await page.click('#contact-form button[type=submit]'); await page.waitForTimeout(300);
  check('forms', 'digitar e-mail inválido e clicar em Enviar: o 1º clique já valida os 3 campos', await page.evaluate(() => document.querySelectorAll('[aria-invalid=true]').length === 3));
  await page.fill('#name', 'Ana'); await page.fill('#email', 'ana@@exemplo'); await page.fill('#message', 'Olá!');
  await page.click('#contact-form button[type=submit]');
  check('forms', 'e-mail inválido é rejeitado e recebe o foco', await page.evaluate(() => document.getElementById('email').getAttribute('aria-invalid') === 'true' && document.activeElement.id === 'email'));
  await page.fill('#email', 'ana@exemplo.com');
  check('forms', 'corrigir o campo limpa o erro dele', await page.evaluate(() => document.getElementById('email-error').textContent === ''));
  // intercepta a navegação mailto
  await page.evaluate(() => { window.__mailto = null; const d = Object.getOwnPropertyDescriptor(Location.prototype, 'href'); });
  const nav = page.waitForEvent('framenavigated', { timeout: 1500 }).catch(() => null);
  await page.click('#contact-form button[type=submit]'); await nav; await page.waitForTimeout(300);
  const ok = await page.evaluate(() => ({ note: document.getElementById('form-note').dataset.state, kept: document.getElementById('message').value }));
  check('forms', 'envio válido: nota de sucesso honesta e mensagem preservada', ok.note === 'success' && ok.kept === 'Olá!', JSON.stringify(ok));
  await ctx.close();

  ({ page, ctx } = await open({ w: 1440, init: (p) => p.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE.replace('/index.html', '') }).catch(() => { }) }));
  await page.evaluate(() => document.getElementById('contact').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(500);
  await page.click('#copy-mail'); await page.waitForTimeout(300);
  const copied = await page.evaluate(() => ({ btn: document.getElementById('copy-mail').textContent, status: document.getElementById('copy-status').textContent }));
  check('forms', 'copiar e-mail dá feedback visual e anunciado (aria-live)', /copiado/i.test(copied.btn) && /copiado/i.test(copied.status), JSON.stringify(copied));
  await ctx.close();

  // chat offline (sem IA): respostas locais e carga sob demanda da base
  for (const lang of ['pt', 'en', 'es', 'ru']) {
    ({ page, ctx } = await open({ w: 1440, lang }));
    const noKb = await page.evaluate(() => typeof window.KNOWLEDGE_BASE === 'undefined');
    if (lang === 'pt') check('forms', 'chat: base de conhecimento NÃO é carregada no início (lazy)', noKb);
    await page.evaluate(() => document.getElementById('kawanny').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(700);
    const status = await page.evaluate(() => document.getElementById('kawanny-status').textContent);
    check('forms', `chat ${lang}: status offline exibido`, /offline|локал|sin conexión|fuera|modo/i.test(status), status);
    const answers = [];
    for (let i = 0; i < 3; i++) {
      await page.locator('.suggestion').nth(i).click();
      await page.waitForFunction((n) => document.querySelectorAll('.bot-message:not([aria-hidden]) .message-content').length >= n && !document.getElementById('chat-messages').hasAttribute('aria-busy'), i + 2, { timeout: 8000 });
      answers.push(await page.evaluate(() => [...document.querySelectorAll('.bot-message:not([aria-hidden]) .message-content')].pop().textContent));
    }
    const generic = answers.filter((a) => /ainda não tenho|don't have a ready|todavía no tengo|пока у меня нет/i.test(a));
    check('forms', `chat ${lang}: as 3 perguntas sugeridas têm resposta real (não o fallback genérico)`, generic.length === 0, answers.map((a) => a.slice(0, 40)).join(' | '));
    await ctx.close();
  }
  ({ page, ctx } = await open({ w: 1440 }));
  const loc = await page.evaluate(async () => { await window.Portfolio.loadScript('js/i18n/knowledge.js'); const f = (q) => window.Portfolio.localAnswer(q, 'pt', window.KNOWLEDGE_BASE); return { digital: f('trabalha com marketing digital?').slice(0, 30), git: f('ele sabe git?').slice(0, 30), oi: f('oi').slice(0, 20) }; });
  check('forms', 'chat: "git" não casa dentro de "digital" (palavras curtas só inteiras)', !/git/i.test(loc.digital) || /ainda não/.test(loc.digital), JSON.stringify(loc));
  await ctx.close();

  // chat com backend simulado: histórico não duplica a mensagem atual
  ({ page, ctx } = await open({ w: 1440, init: async (p) => {
    p.__bodies = [];
    await p.route('**/api/chat', async (route) => {
      const req = route.request();
      if (req.method() === 'GET') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"ai":true}' });
      p.__bodies.push(JSON.parse(req.postData()));
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ reply: 'Resposta simulada ' + p.__bodies.length }) });
    });
  } }));
  await page.evaluate(() => document.getElementById('kawanny').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(600);
  const stOn = await page.evaluate(() => document.getElementById('kawanny-status').textContent);
  check('forms', 'chat com backend: status online', /online|IA/i.test(stOn), stOn);
  await page.fill('#chat-input', 'primeira pergunta'); await page.press('#chat-input', 'Enter');
  await page.waitForFunction(() => document.querySelectorAll('.bot-message:not([aria-hidden])').length >= 2 && !document.getElementById('chat-messages').hasAttribute('aria-busy'), null, { timeout: 8000 });
  await page.fill('#chat-input', 'segunda pergunta'); await page.press('#chat-input', 'Enter');
  await page.waitForFunction(() => document.querySelectorAll('.bot-message:not([aria-hidden])').length >= 3 && !document.getElementById('chat-messages').hasAttribute('aria-busy'), null, { timeout: 8000 });
  const b = page.__bodies;
  check('forms', 'chat: 1º envio com histórico vazio (bug original duplicava a mensagem)', b[0] && b[0].history.length === 0 && b[0].message === 'primeira pergunta', JSON.stringify(b[0]));
  check('forms', 'chat: 2º envio leva só o par anterior, sem repetir a pergunta atual', b[1] && b[1].history.length === 2 && !b[1].history.some((m) => m.content === 'segunda pergunta') && b[1].lang === 'pt', JSON.stringify(b[1]));
  check('forms', 'chat: log é região aria-live e campo reabilita após resposta', await page.evaluate(() => document.getElementById('chat-messages').getAttribute('role') === 'log' && !document.getElementById('chat-input').disabled));
  await ctx.close();
}

/* ============================================================ 7. Contraste (tokens) */
if (want('contrast')) {
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const hex = (h) => { h = h.trim().replace('#', ''); if (h.length === 3) h = [...h].map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  for (const theme of ['dark', 'light']) {
    const { page, ctx } = await open({ theme, wait: 300 });
    const t = await page.evaluate(() => { const cs = getComputedStyle(document.documentElement); const g = (n) => cs.getPropertyValue(n).trim(); return { bg: g('--bg'), surface: g('--surface'), surface2: g('--surface-2'), surface3: g('--surface-3'), ink: g('--ink'), dim: g('--ink-dim'), faint: g('--ink-faint'), accent: g('--accent'), ok: g('--ok'), warn: g('--warn'), danger: g('--danger') }; });
    const pairs = [['ink/bg', t.ink, t.bg], ['ink-dim/bg', t.dim, t.bg], ['ink-faint/bg', t.faint, t.bg], ['ink-dim/surface', t.dim, t.surface], ['ink-faint/surface', t.faint, t.surface], ['ink/surface-3 (msg do bot)', t.ink, t.surface3], ['ink-dim/surface-2', t.dim, t.surface2], ['accent/bg', t.accent, t.bg], ['ok/bg', t.ok, t.bg], ['warn/bg', t.warn, t.bg], ['danger/bg', t.danger, t.bg], ['danger/surface', t.danger, t.surface], ['texto do botão (#000 ou #fff)/accent', theme === 'dark' ? '#000' : '#fff', t.accent]];
    for (const [name, fg, bgc] of pairs) { const r = ratio(hex(fg), hex(bgc)); check('contrast', `${theme}: ${name} ≥ 4.5:1`, r >= 4.5, r.toFixed(2) + ':1'); }
    await ctx.close();
  }
}

/* ============================================================ 8. Performance (métricas de laboratório) */
if (want('perf')) {
  const { page, ctx } = await open({ w: 390, h: 844, wait: 0, init: async (p) => {
    await p.addInitScript(() => {
      window.__m = { cls: 0, lcp: 0, long: 0, longMax: 0 };
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => { const e = l.getEntries().pop(); window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__m.long += e.duration; window.__m.longMax = Math.max(window.__m.longMax, e.duration); } }).observe({ type: 'longtask', buffered: true });
    });
    p.__bytes = {}; p.on('response', async (r) => { try { const b = await r.body(); const t = (r.headers()['content-type'] || '').split(';')[0]; p.__bytes[t] = (p.__bytes[t] || 0) + b.length; } catch (e) { } });
  } });
  await page.waitForTimeout(3500);
  await scrollThrough(page);
  const m = await page.evaluate(() => window.__m);
  const bytes = page.__bytes;
  const js = (bytes['text/javascript'] || 0), css = (bytes['text/css'] || 0), imgs = (bytes['image/webp'] || 0) + (bytes['image/png'] || 0) + (bytes['image/svg+xml'] || 0), html = bytes['text/html'] || 0;
  const rows = `CLS ${m.cls.toFixed(4)} · LCP ${Math.round(m.lcp)}ms · long tasks ${Math.round(m.long)}ms (máx ${Math.round(m.longMax)}ms) · JS ${(js / 1024).toFixed(1)}KB · CSS ${(css / 1024).toFixed(1)}KB · HTML ${(html / 1024).toFixed(1)}KB · imagens ${(imgs / 1024).toFixed(0)}KB (após rolar tudo, sem vídeos)`;
  check('perf', 'CLS ≤ 0.1 (mobile 390, fontes de reserva)', m.cls <= 0.1, rows);
  warn('perf', 'long tasks com WebGL em software (SwiftShader do sandbox; em GPU real o custo é uma fração)', `${Math.round(m.long)}ms no total, máx ${Math.round(m.longMax)}ms`);
  await ctx.close();
  // código do site isolado: sem WebGL, nenhuma tarefa longa > 200ms
  const noGl = await open({ w: 390, h: 844, wait: 0, init: async (p) => {
    await p.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type) { return /webgl/.test(type) ? null : orig.apply(this, arguments); };
      window.__longMax = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__longMax = Math.max(window.__longMax, e.duration); }).observe({ type: 'longtask', buffered: true });
    });
  } });
  await noGl.page.waitForTimeout(3000);
  await scrollThrough(noGl.page);
  const codeMax = await noGl.page.evaluate(() => window.__longMax);
  check('perf', 'código do site: nenhuma long task > 200ms (WebGL desligado, mobile 390)', codeMax <= 200, `máx ${Math.round(codeMax)}ms`);
  await noGl.ctx.close();
  check('perf', 'JS total < 100KB', js < 100 * 1024, `${(js / 1024).toFixed(1)}KB`);
  warn('perf', 'métricas', rows);
}

/* ---------------------------------------------------------------- relatório */
await browser.close();
server.close();
const groups = [...new Set(results.map((r) => r.group))];
let failed = 0;
for (const g of groups) {
  const rs = results.filter((r) => r.group === g);
  console.log(`\n── ${g} (${rs.filter((r) => r.ok).length}/${rs.length})`);
  for (const r of rs) {
    if (!r.ok) failed++;
    console.log(`  ${r.ok ? (r.warn ? 'ℹ️ ' : '✅') : '❌'} ${r.name}${r.detail && (!r.ok || r.warn) ? `\n       ${r.detail}` : ''}`);
  }
}
console.log(`\n${failed === 0 ? '✅ TUDO OK' : `❌ ${failed} falha(s)`} — ${results.filter((r) => r.ok && !r.warn).length} testes passaram de ${results.filter((r) => !r.warn).length}`);
process.exit(failed ? 1 : 0);
