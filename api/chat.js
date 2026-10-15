// api/chat.js
// Função serverless (Vercel) que dá à Kawanny acesso a um modelo de IA real,
// mantendo a chave de API em segredo no servidor (nunca no navegador).
//
// Configuração na Vercel:
//   1. Project Settings → Environment Variables
//   2. Adicione ANTHROPIC_API_KEY com sua chave da Anthropic
//      (opcional) ANTHROPIC_MODEL para trocar o modelo; o padrão abaixo é o que já estava em uso
//   3. Redeploy o projeto
//
// Sem a variável configurada, GET devolve { ai: false } e o front-end (js/chat.js)
// usa automaticamente o modo de reserva local.

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `Você é Kawanny, a assistente de IA do portfólio de Evertton Thiago,
um desenvolvedor front-end de 18 anos em formação full stack (HTML, CSS, JavaScript,
React, Node.js, Python, Git). Ele mudou de carreira recentemente e está construindo
experiência com projetos reais e certificações (DevClub HTML, DevClub CSS, JavaScript
com IA, Git & GitHub). Contato: everttondark3@gmail.com, LinkedIn evertton-thiago-1953203bb,
Instagram @evertton.th_. Responda de forma direta, simpática e
objetiva, no idioma indicado nas instruções abaixo. Você pode responder qualquer pergunta, não só sobre o Evertton — inclusive
dúvidas gerais de programação, tecnologia ou conversas casuais. Mantenha respostas curtas
(no máximo 3-4 frases) a menos que o usuário peça mais detalhe.`;

const LANGUAGE_NAMES = { pt: 'português do Brasil', en: 'English', es: 'español', ru: 'русском языке' };

const MAX_MESSAGE = 2000;
const MAX_HISTORY = 8;
const REQUEST_TIMEOUT_MS = 15000;

// Limite simples por IP (12 mensagens/min). Em memória: vale por instância da função,
// suficiente para frear abuso casual de um portfólio. Para algo mais forte, use um KV externo.
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < 60000)) hits.delete(key);
    }
  }
  return recent.length > 12;
};

// Histórico vindo do navegador não é confiável: normaliza papéis, tamanhos e ordem.
const sanitizeHistory = (history) => {
  const clean = (Array.isArray(history) ? history : [])
    .filter((m) => m && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content.slice(0, MAX_MESSAGE),
    }));
  while (clean.length && clean[0].role !== 'user') clean.shift(); // a API exige começar por "user"
  return clean;
};

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    // health-check barato: o site pergunta se a IA está configurada sem gastar tokens
    res.status(200).json({ ok: true, ai: Boolean(process.env.ANTHROPIC_API_KEY) });
    return;
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anon';
  if (limited(ip)) {
    res.status(429).json({ error: 'Muitas mensagens em pouco tempo. Tente de novo em instantes.' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'IA não configurada no servidor.' });
    return;
  }

  const { message, history, lang } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Campo "message" é obrigatório.' });
    return;
  }

  const languageInstruction = `Responda SEMPRE em ${LANGUAGE_NAMES[lang] || LANGUAGE_NAMES.pt}, independente do idioma da pergunta.`;
  const messages = [...sanitizeHistory(history), { role: 'user', content: message.trim().slice(0, MAX_MESSAGE) }];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
        max_tokens: 400,
        system: `${SYSTEM_PROMPT}\n\n${languageInstruction}`,
        messages,
      }),
    });

    if (!response.ok) {
      // O detalhe fica só nos logs do servidor: nunca devolvemos o corpo do erro ao navegador.
      console.error('[api/chat] erro da API de IA:', response.status, (await response.text()).slice(0, 500));
      res.status(502).json({ error: 'A IA não conseguiu responder agora.' });
      return;
    }

    const data = await response.json();
    const reply = data.content?.find((block) => block.type === 'text')?.text?.trim();
    if (!reply) {
      res.status(502).json({ error: 'A IA devolveu uma resposta vazia.' });
      return;
    }
    res.status(200).json({ reply });
  } catch (error) {
    console.error('[api/chat] falha:', error && error.name === 'AbortError' ? 'timeout' : error);
    res.status(error && error.name === 'AbortError' ? 504 : 500).json({ error: 'Erro ao processar a mensagem.' });
  } finally {
    clearTimeout(timer);
  }
};
