interface Env {
  AI_API_KEY?: string;
  AI_API_URL?: string;
  AI_MODEL?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  if (!env.AI_API_KEY || !env.AI_API_URL || !env.AI_MODEL) {
    return json({ error: 'AI backend haijasanidiwa. Weka AI_API_KEY, AI_API_URL na AI_MODEL kwenye Cloudflare Pages environment variables.' }, 503);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 12000) return json({ error: 'Ujumbe ni mrefu sana. Punguza maandishi ujaribu tena.' }, 413);

  let payload: { question?: unknown; market?: unknown; contract?: unknown };
  try {
    payload = await request.json() as typeof payload;
  } catch {
    return json({ error: 'Ombi halijasomeka.' }, 400);
  }

  const question = typeof payload.question === 'string' ? payload.question.trim().slice(0, 4000) : '';
  const market = typeof payload.market === 'string' ? payload.market.slice(0, 100) : 'Not specified';
  const contract = typeof payload.contract === 'string' ? payload.contract.slice(0, 100) : 'Not specified';
  if (!question) return json({ error: 'Andika swali kwanza.' }, 400);

  const system = [
    'You are MBUNIFX AI, an educational trading and risk-management assistant.',
    'Explain uncertainty clearly. Never promise profits or claim guaranteed predictions.',
    'Never fabricate live prices, ticks, digit frequencies, signals, account balances, trade outcomes, or market data.',
    'If asked for a live signal or prediction without supplied verified market data, say that live Deriv tick data is not connected and do not invent a digit or direction.',
    'Do not ask for or expose passwords, API tokens, or account secrets.',
    'Do not place trades. Auto trading and execution are outside this assistant.',
    'Give concise, practical answers. The user may speak Swahili; reply in the language used by the user.',
  ].join(' ');

  try {
    const upstream = await fetch(env.AI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.AI_MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `Market: ${market}\nContract: ${contract}\nQuestion: ${question}` },
        ],
        temperature: 0.3,
        max_tokens: 700,
      }),
    });

    if (!upstream.ok) {
      return json({ error: `AI provider imerudisha hitilafu (${upstream.status}). Angalia AI_API_URL, model na API key kwenye Cloudflare.` }, 502);
    }

    const data = await upstream.json() as { choices?: Array<{ message?: { content?: string } }> };
    const answer = data.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) return json({ error: 'AI provider haikurudisha jibu. Jaribu tena.' }, 502);
    return json({ answer: answer.trim() });
  } catch {
    return json({ error: 'Imeshindikana kuwasiliana na AI provider. Hakikisha API URL ni sahihi na ujaribu tena.' }, 502);
  }
};

export const onRequestGet = async (): Promise<Response> =>
  json({ status: 'MBUNIFX AI endpoint ready; provider configuration is required.' });
