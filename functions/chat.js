import { SYSTEM_PROMPT } from './system-prompt.js';

export async function onRequestPost(context) {
  const apiKey = context.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'API key not configured. Set GEMINI_API_KEY in environment variables.' }, 500);
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonResponse({ error: 'messages array is required' }, 400);
  }

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content).slice(0, 2000) }]
  }));

  let geminiRes, data;
  try {
    geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
        })
      }
    );
    data = await geminiRes.json();
  } catch (err) {
    console.error('[chat] Gemini fetch/parse error:', err.message);
    return jsonResponse({ error: 'Failed to reach Gemini API: ' + err.message }, 502);
  }

  if (!geminiRes.ok) {
    const msg = data?.error?.message ?? `Gemini HTTP ${geminiRes.status}`;
    console.error('[chat] Gemini error response:', msg);
    return jsonResponse({ error: msg }, 502);
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) {
    console.error('[chat] Unexpected Gemini shape:', JSON.stringify(data).slice(0, 300));
    return jsonResponse({ error: 'Empty response from Gemini' }, 502);
  }

  return jsonResponse({ reply });
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
