// api/chat.js
// Função serverless (Vercel) que dá à Kawanny acesso a um modelo de IA real,
// mantendo a chave de API em segredo no servidor (nunca no navegador).
//
// Configuração na Vercel:
//   1. Project Settings → Environment Variables
//   2. Adicione ANTHROPIC_API_KEY com sua chave da Anthropic
//   3. Redeploy o projeto
//
// Sem essa variável configurada, esta função responde com erro e o
// front-end (scripts.js) cai automaticamente no modo de reserva local.

const SYSTEM_PROMPT = `Você é Kawanny, a assistente de IA do portfólio de Evertton Thiago,
um desenvolvedor front-end de 18 anos em formação full stack (HTML, CSS, JavaScript,
React, Node.js, Python, Git). Ele mudou de carreira recentemente e está construindo
experiência com projetos reais e certificações (DevClub HTML, DevClub CSS, JavaScript
com IA, Git & GitHub). Contato: everttondark3@gmail.com, LinkedIn evertton-thiago-1953203bb,
Instagram @evertton.th_. Responda de forma direta, simpática e
objetiva, no idioma indicado nas instruções abaixo. Você pode responder qualquer pergunta, não só sobre o Evertton — inclusive
dúvidas gerais de programação, tecnologia ou conversas casuais. Mantenha respostas curtas
(no máximo 3-4 frases) a menos que o usuário peça mais detalhe.`;

const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 12; // 12 mensagens por minuto por IP
};

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    // health-check barato: o site pergunta se a IA está configurada sem gastar tokens
    res.status(200).json({ ok: true, ai: Boolean(process.env.ANTHROPIC_API_KEY) });
    return;
  }
  if (req.method !== 'POST') {
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
    res.status(503).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor.' });
    return;
  }

  try {
    const { message, history, lang } = req.body || {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Campo "message" é obrigatório.' });
      return;
    }

    const languageNames = { pt: 'português do Brasil', en: 'English', es: 'español', ru: 'русском языке' };
    const languageInstruction = `Responda SEMPRE em ${languageNames[lang] || 'português do Brasil'}, independente do idioma da pergunta.`;

    const messages = [
      ...(Array.isArray(history) ? history.slice(-8) : []).map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content || '').slice(0, 2000),
      })),
      { role: 'user', content: message.slice(0, 2000) },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `${SYSTEM_PROMPT}\n\n${languageInstruction}`,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: `Erro da API de IA: ${errText}` });
      return;
    }

    const data = await response.json();
    const reply = data.content?.find((block) => block.type === 'text')?.text?.trim();

    if (!reply) {
      res.status(502).json({ error: 'Resposta vazia do modelo.' });
      return;
    }

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao processar a mensagem.' });
  }
};
