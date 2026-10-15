/* ==========================================================================
   js/background.js — "seda de luz" do hero (WebGL, sem dependências)
   - Monocromática: luz fria sobre o preto (escura sobre o papel no tema claro).
   - Alfa pré-multiplicado: o preto é transparente e a grade de pontos do fundo
     continua visível por baixo.
   - Renderiza SÓ enquanto o hero está na tela e a aba está ativa; qualidade
     adaptativa; um único quadro estático com prefers-reduced-motion.
   - Sem WebGL / contexto perdido: <html class="no-gl"> e o CSS usa um brilho simples.
   ========================================================================== */
(function () {
  'use strict';
  var P = window.Portfolio;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FRAG = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 R, M; uniform float T, L, K, I;',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / R;',
    '  vec2 p = (gl_FragCoord.xy - .5 * R) / R.y;',
    '  vec2 m = (M - .5 * R) / R.y;',
    '  float t = T * .06;',
    '  float body = 0.; float crest = 0.;',
    '  for (int i = 0; i < 4; i++){',
    '    float fi = float(i);',
    '    float y = .15 * sin(p.x * 1.3 + t * 1.1 + fi * 1.9) + .075 * sin(p.x * 2.9 - t * 1.5 + fi * 3.1)',
    '            + .03 * sin(p.x * 5.1 + t * 2. + fi * 4.3) + (fi - 1.5) * .12 - .08;',
    '    float dx = p.x - m.x;',
    '    y += (m.y - y) * .12 * exp(-dx * dx * 4.) * K;',      // o ponteiro curva as faixas
    '    float d = p.y - y;',
    '    float a = 1. - fi * .2;',
    '    body += exp(-abs(d) * 7.) * (d > 0. ? .3 : 1.) * a;',
    '    crest += exp(-d * d * 3200.) * a;',
    '  }',
    '  float zone = .1 + .9 * smoothstep(-.5, .35, p.x);',     // área do nome fica mais calma
    '  float g = (body * .07 + crest * .5) * zone;',
    '  g *= smoothstep(0., .25, uv.y) ;',                      // dissolve na borda inferior
    '  vec3 ink = mix(vec3(.82, .87, 1.), vec3(.09, .10, .22), L);',
    '  float a = clamp(g, 0., 1.) * mix(1., .62, L) * I;',
    '  a = max(a + (hash(gl_FragCoord.xy) - .5) / 255., 0.);',  // dither: sem faixas no degradê
    '  gl_FragColor = vec4(ink * a, a);',
    '}',
  ].join('\n');

  P.register('silk', function () {
    // Compilar o shader e criar o contexto custa dezenas de ms: espera o navegador
    // ficar ocioso (depois da 1ª pintura) em vez de competir com o LCP.
    var idle = window.requestIdleCallback ? function (fn) { requestIdleCallback(fn, { timeout: 800 }); } : function (fn) { setTimeout(fn, 250); };
    idle(function () {
      var canvas = P.$('#silk');
      var hero = P.$('#home');
      var root = document.documentElement;
      if (!canvas || !hero) return;

      var gl = canvas.getContext('webgl', {
        alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power',
      });
      if (!gl) { root.classList.add('no-gl'); return; }

      var compile = function (type, src) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
        console.warn('[silk] shader:', gl.getShaderInfoLog(shader));
        return null;
      };
      var vs = compile(gl.VERTEX_SHADER, VERT);
      var fs = compile(gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) { root.classList.add('no-gl'); return; }
      var program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { root.classList.add('no-gl'); return; }
      gl.useProgram(program);

      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(program, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      var U = {};
      ['R', 'M', 'T', 'L', 'K', 'I'].forEach(function (name) { U[name] = gl.getUniformLocation(program, name); });
      gl.clearColor(0, 0, 0, 0);

      var still = P.reducedMotion();
      var small = window.matchMedia('(max-width: 700px)').matches;
      var quality = small ? 0.5 : 0.6;
      var scale = 1, width = 2, height = 2;
      var theme = root.getAttribute('data-theme') === 'light' ? 1 : 0;   // valor suavizado
      var pointer = { x: -1, y: -1, k: 0, kTarget: 0 };
      var visible = true, raf = 0, last = 0, acc = 0, frames = 0, startedAt = performance.now();

      var resize = function () {
        var box = hero.getBoundingClientRect();
        scale = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5) * quality;
        width = canvas.width = Math.max(2, Math.round(box.width * scale));
        height = canvas.height = Math.max(2, Math.round(box.height * scale));
        gl.viewport(0, 0, width, height);
        if (pointer.x < 0) { pointer.x = width * 0.72; pointer.y = height * 0.5; }
        if (!raf) draw(performance.now());
      };

      var themeTarget = function () { return root.getAttribute('data-theme') === 'light' ? 1 : 0; };

      var draw = function (now) {
        var dt = Math.min(now - (draw.t || now), 400);
        draw.t = now;
        if (still) {
          theme = themeTarget();
        } else {
          theme += (themeTarget() - theme) * (1 - Math.exp(-dt / 220));
          pointer.k += (pointer.kTarget - pointer.k) * (1 - Math.exp(-dt / 500));
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(U.R, width, height);
        gl.uniform2f(U.M, pointer.x, pointer.y);
        gl.uniform1f(U.T, still ? 38 : (now - startedAt) / 1000 + 30);
        gl.uniform1f(U.L, theme);
        gl.uniform1f(U.K, pointer.k);
        gl.uniform1f(U.I, small ? 0.7 : 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      var loop = function (now) {
        draw(now);
        var dt = now - last; last = now;
        if (dt < 200) { acc += dt; frames++; }
        if (frames === 90) {                       // qualidade adaptativa se o aparelho sofrer
          if (acc / frames > 28 && quality > 0.34) { quality *= 0.8; resize(); }
          acc = frames = 0;
        }
        raf = requestAnimationFrame(loop);
      };
      var start = function () {
        if (raf || still || !visible || document.hidden) return;
        last = performance.now(); draw.t = 0;
        raf = requestAnimationFrame(loop);
      };
      var stop = function () { if (raf) cancelAnimationFrame(raf); raf = 0; };

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
          if (visible) start(); else stop();
        }, { threshold: 0 }).observe(hero);
      }
      document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
      if ('ResizeObserver' in window) new ResizeObserver(P.frame(resize)).observe(hero);
      else addEventListener('resize', P.frame(resize));
      document.addEventListener('portfolio:theme', function () { if (still || !raf) draw(performance.now()); });

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !still) {
        addEventListener('pointermove', function (e) {
          var box = canvas.getBoundingClientRect();
          pointer.x = (e.clientX - box.left) * scale;
          pointer.y = (box.bottom - e.clientY) * scale;
          pointer.kTarget = 1;
        }, { passive: true });
        document.addEventListener('pointerleave', function () { pointer.kTarget = 0; });
      }

      canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); stop(); root.classList.add('no-gl'); });

      resize();
      start();
    });
  });
})();
