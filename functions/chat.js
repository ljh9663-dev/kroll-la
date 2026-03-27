const SYSTEM_PROMPT = `You are the AI assistant for K-Roll LA, a robotic kimbap restaurant in Koreatown, Los Angeles. You help customers with menu questions, dietary needs, ordering, and anything about K-Roll LA.

Key facts:
- Location: 3500 Wilshire Blvd, Los Angeles, CA 90010
- Contact: hello@kroll-la.com | (213) 555-ROLL
- Robotic precision rolling: 45-second prep time, 450 PSI
- Over 1,000 possible combinations
- Supports 5 languages — respond in the same language the customer uses

Menu:
- LA Galbi Roll: sweet soy short rib, pickled radish, grilled scallions — $15 (Meat) ⭐ Best Seller
- The Classic: traditional tuna, egg, spinach, carrot — $12 (Gluten-Free)
- Seoul Spice Roll: fire chicken, jalapeño, cucumber — $14 (Meat, Spicy)
- Garden Roll: avocado, sweet potato, pickled burdock — $13 (Vegan)
- K-BBQ Fusion: bulgogi beef, kimchi, sesame — $16 (Meat)
- Sunrise Roll: spam musubi style with egg and pickled daikon — $13 (Gluten-Free)

Be friendly, concise, and enthusiastic about the food. Never make up information not listed above.`;

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
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
