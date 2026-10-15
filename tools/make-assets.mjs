/* Gera os ativos derivados do portfólio a partir dos originais.
   Uso:  npm i --no-save sharp   &&   node tools/make-assets.mjs
   Seguro para rodar de novo: só (re)escreve arquivos gerados, nunca os originais.

   Gera:
   - assets/icons/favicon.svg, favicon-32.png, apple-touch-icon.png
   - assets/img/noise.png            (textura de grão, substitui filtro SVG em tempo real)
   - assets/img/og-cover.png         (1200×630, compartilhamento em redes)
   - assets/img/perfil-480.webp / perfil-800.webp
   - assets/img/cert-*-640.webp      (miniaturas dos certificados; os originais ficam no visualizador)
*/
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const img = (f) => path.join(root, 'assets/img', f);
const ico = (f) => path.join(root, 'assets/icons', f);
fs.mkdirSync(path.join(root, 'assets/icons'), { recursive: true });

/* ---------- Marca: "E" geométrico + ponto (o mesmo ponto do logotipo "Evertton.") ---------- */
const MARK = (size = 512, { bg = '#000', fg = '#f4f3ef', dot = '#a9b8ff', radius = 0.22 } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${64 * radius}" fill="${bg}"/>
  <path fill="${fg}" d="M18 14h24v6H25v8h14v6H25v8h18v6H18z"/>
  <circle cx="47.5" cy="47.5" r="3.4" fill="${dot}"/>
</svg>`;

fs.writeFileSync(ico('favicon.svg'), MARK(64).trim() + '\n');
await sharp(Buffer.from(MARK(256))).resize(32, 32).png().toFile(ico('favicon-32.png'));
await sharp(Buffer.from(MARK(512, { radius: 0 }))).resize(180, 180).png().toFile(ico('apple-touch-icon.png'));

/* ---------- Ruído (grão) 96×96, escala de cinza com alfa ---------- */
{
  const size = 96;
  const raw = Buffer.alloc(size * size * 2);
  let seed = 1337;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < size * size; i++) {
    raw[i * 2] = 255; // luminância branca
    raw[i * 2 + 1] = Math.floor(rnd() * 6) * 48; // alfa em 6 níveis: comprime bem e basta para quebrar bandas
  }
  await sharp(raw, { raw: { width: size, height: size, channels: 2 } }).png({ compressionLevel: 9, palette: true, colors: 8 }).toFile(img('noise.png'));
}

/* ---------- Imagem de compartilhamento 1200×630 ---------- */
{
  const og = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <radialGradient id="g" cx="82%" cy="12%" r="70%">
        <stop offset="0" stop-color="#fff" stop-opacity=".16"/>
        <stop offset=".55" stop-color="#fff" stop-opacity=".03"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="#000"/>
    <rect width="1200" height="630" fill="url(#g)"/>
    <g transform="translate(72 72) scale(1.1)">
      <path fill="#f4f3ef" d="M18 14h24v6H25v8h14v6H25v8h18v6H18z" transform="translate(-14 -10) scale(.9)"/>
      <circle cx="39" cy="38" r="3" fill="#a9b8ff"/>
    </g>
    <text x="72" y="392" font-family="Lora, 'Liberation Serif', Georgia, serif" font-size="132" fill="#f4f3ef" letter-spacing="-4">Evertton Thiago</text>
    <text x="76" y="462" font-family="'Liberation Sans', Arial, sans-serif" font-size="34" fill="#a4a4a8">Desenvolvedor front-end em transição para full stack</text>
    <rect x="76" y="520" width="1048" height="1" fill="#fff" opacity=".14"/>
    <text x="76" y="570" font-family="'Liberation Sans', Arial, sans-serif" font-size="26" fill="#7b7b82">HTML · CSS · JavaScript · Git · React · Node.js · Python</text>
  </svg>`;
  await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(img('og-cover.png'));
}

/* ---------- Variantes responsivas ---------- */
const variants = [
  ['perfil.webp', 'perfil-480.webp', 480, 78],
  ['perfil.webp', 'perfil-800.webp', 800, 78],
  ['cert-html.webp', 'cert-html-640.webp', 640, 80],
  ['cert-css.webp', 'cert-css-640.webp', 640, 80],
  ['cert-js-ia.webp', 'cert-js-ia-640.webp', 640, 80],
  ['cert-git.webp', 'cert-git-640.webp', 640, 80],
];
for (const [src, out, width, quality] of variants) {
  await sharp(img(src)).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(img(out));
}

for (const f of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png']) {
  console.log('assets/icons/' + f.padEnd(24), (fs.statSync(ico(f)).size / 1024).toFixed(1) + ' KB');
}
for (const f of ['noise.png', 'og-cover.png', ...variants.map((v) => v[1])]) {
  console.log('assets/img/' + f.padEnd(26), (fs.statSync(img(f)).size / 1024).toFixed(1) + ' KB');
}
