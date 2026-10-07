/* Fundo fluido: campo de ruído com domain warping + linhas de contorno.
   - paleta muda suavemente com o scroll e com o tema
   - o ponteiro cria um redemoinho leve
   - qualidade adaptativa, pausa em aba oculta, estático com prefers-reduced-motion
   - sem WebGL: cai para o gradiente CSS (.no-gl) */
(() => {
  const cv = document.getElementById('bg');
  if (!cv) return;
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return root.classList.add('no-gl');

  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R, M; uniform float T, W, L; uniform vec3 A, B, C, D, K;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 uv = gl_FragCoord.xy / R;
  vec2 p = (gl_FragCoord.xy - .5 * R) / R.y;
  vec2 m = (M - .5 * R) / R.y;
  float t = T * .07;
  vec3 rc = vec3(0.); float w = 0.;
  /* quatro faixas de seda: ondas somadas, corpo suave + linha luminosa na borda */
  for (int i = 0; i < 4; i++){
    float fi = float(i);
    float y = .17 * sin(p.x * 1.5 + t * 1.1 + fi * 1.9) + .085 * sin(p.x * 3. - t * 1.5 + fi * 3.1)
            + .04 * sin(p.x * 5.2 + t * 2. + fi * 4.3) + (fi - 1.5) * .15 - .3;
    float dx = p.x - m.x;
    y += (m.y - y) * .14 * exp(-dx * dx * 4.);          // o cursor curva as faixas
    float d = p.y - y;
    vec3 c = mix(mix(B, C, step(.5, fi)), mix(D, B, step(2.5, fi)), step(1.5, fi));
    float a = 1. - fi * .18;
    float body = exp(-abs(d) * 5.5) * (d > 0. ? .45 : 1.);
    float crest = exp(-d * d * 2200.);
    rc += c * body * a * .55 + K * crest * a * .5;
    w += body * a * .55 + crest * a * .35;
  }
  float zone = (.22 + .78 * smoothstep(-.45, .4, p.x)) * W;   // mantém a área do texto mais calma
  rc *= zone; w *= zone;
  vec3 dk = A + rc;
  vec3 lt = mix(A, rc / max(w, .001), clamp(w, 0., 1.) * .9);
  vec3 col = mix(dk, lt, L);
  col *= 1. - (.6 - .5 * L) * dot(uv - .5, uv - .5);
  col += (h(gl_FragCoord.xy) - .5) / 255.;
  gl_FragColor = vec4(col, 1.);
}`;

  const mk = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : (console.warn(gl.getShaderInfoLog(s)), null);
  };
  const vs = mk(gl.VERTEX_SHADER, VS), fs = mk(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return root.classList.add('no-gl');
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return root.classList.add('no-gl');
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  ['R', 'M', 'T', 'W', 'L', 'A', 'B', 'C', 'D', 'K'].forEach((k) => (U[k] = gl.getUniformLocation(prog, k)));

  /* paletas: [base, profundo, violeta/azul, brasa, linha] por faixa de scroll */
  const hx = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const PAL = {
    dark: [
      ['#03040a', '#2f4bd8', '#7a4bd8', '#1fa3b8', '#c9d4ff'],
      ['#030609', '#1f7ad8', '#16a3a8', '#3a5bd8', '#bff4ee'],
      ['#06030a', '#6a3bd8', '#c0449a', '#ff8a6a', '#ffd9c8'],
    ].map((r) => r.map(hx)),
    light: [
      ['#f5f6fd', '#9fb4ff', '#c3a8f5', '#9edbe6', '#3a3fa8'],
      ['#f2f7fa', '#9ccdf2', '#9fe0dc', '#adc2f6', '#1f6a80'],
      ['#faf5fa', '#cdaaf2', '#f2a8cc', '#fbc9a8', '#7a35a0'],
    ].map((r) => r.map(hx)),
  };
  const mixv = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const pick = (set, s) => {
    const x = Math.min(s, 0.9999) * 2, i = Math.floor(x), f = x - i, e = f * f * (3 - 2 * f);
    return set[i].map((c, k) => mixv(c, set[i + 1][k], e));
  };
  const isLight = () => document.body.classList.contains('light-theme');
  const scrollP = () => {
    const m = document.documentElement.scrollHeight - innerHeight;
    return m > 0 ? scrollY / m : 0;
  };

  let q = 0.6, sc = 1, W = 2, H = 2, th = isLight() ? 1 : 0, cs = scrollP();
  let mx = 0, my = 0, tx = 0, ty = 0;
  const size = () => {
    sc = Math.min(devicePixelRatio || 1, 1.5) * q;
    W = cv.width = Math.max(2, Math.round(innerWidth * sc));
    H = cv.height = Math.max(2, Math.round(innerHeight * sc));
    gl.viewport(0, 0, W, H);
    if (!mx) { mx = tx = W * 0.72; my = ty = H * 0.62; }
  };
  size();

  const draw = (now) => {
    const target = isLight() ? 1 : 0;
    if (still) { th = target; cs = scrollP(); }
    else {
      const dt = Math.min(now - (draw.t || now), 400); draw.t = now;   // suavização por tempo, não por quadro
      const k = (tau) => 1 - Math.exp(-dt / tau);
      th += (target - th) * k(200);
      cs += (scrollP() - cs) * k(900);
      mx += (tx - mx) * k(380); my += (ty - my) * k(380);
    }
    const pd = pick(PAL.dark, cs), pl = pick(PAL.light, cs);
    const c = pd.map((v, k) => mixv(v, pl[k], th));
    gl.uniform2f(U.R, W, H);
    gl.uniform2f(U.M, mx, my);
    gl.uniform1f(U.T, still ? 38 : now / 1000);
    gl.uniform1f(U.W, 0.8);
    gl.uniform1f(U.L, th);
    gl.uniform3fv(U.A, c[0]); gl.uniform3fv(U.B, c[1]); gl.uniform3fv(U.C, c[2]);
    gl.uniform3fv(U.D, c[3]); gl.uniform3fv(U.K, c[4]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  addEventListener('resize', () => { size(); if (still) draw(0); });
  addEventListener('pointermove', (e) => { tx = e.clientX * sc; ty = (innerHeight - e.clientY) * sc; }, { passive: true });
  cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); root.classList.add('no-gl'); });

  if (still) {
    draw(0);
    addEventListener('scroll', () => draw(0), { passive: true });
    new MutationObserver(() => draw(0)).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return;
  }

  let last = performance.now(), acc = 0, frames = 0;
  const loop = (now) => {
    draw(now);
    const dt = now - last; last = now;
    if (dt < 200) { acc += dt; frames++; }
    if (frames === 90) {            // qualidade adaptativa: baixa a resolução se o aparelho sofrer
      if (acc / frames > 28 && q > 0.36) { q *= 0.8; size(); }
      acc = frames = 0;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
