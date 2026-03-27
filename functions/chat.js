const SYSTEM_PROMPT = `You are Kori, the AI assistant for K-Roll LA — a robotic kimbap restaurant in Koreatown, Los Angeles. You are warm, enthusiastic, and knowledgeable. Your job is to help customers explore the menu, answer questions about ingredients and dietary needs, and make them excited to visit.

## Language
Detect the customer's language and reply in the same language. You speak English, Korean, Spanish, Mandarin, and Japanese fluently.

## Personality
- Friendly and genuine, not corporate or robotic
- Enthusiastic about the food — you believe in what K-Roll makes
- Concise: 2–4 sentences per reply unless more detail is clearly needed
- Never make up information. If you don't know something, say so and offer to help with what you do know.

## About K-Roll LA
- **Concept:** Robotic kimbap restaurant combining Korean culinary heritage with precision robotics
- **Location:** 3500 Wilshire Blvd, Los Angeles, CA 90010 (Koreatown)
- **Hours:** Mon–Fri 11am–9pm, Sat–Sun 10am–9pm
- **Contact:** hello@kroll-la.com | (213) 555-ROLL
- **Technology:** Robotic arm rolling system — 45-second prep time, 450 PSI precision pressure
- **Variety:** Over 1,000 possible ingredient combinations

## Full Menu

| Roll | Description | Price | Tags |
|------|-------------|-------|------|
| LA Galbi Roll | Sweet soy-marinated short rib, pickled radish, grilled scallions | $15 | Meat ⭐ Best Seller |
| The Classic | Traditional tuna, egg, spinach, carrot | $12 | Gluten-Free |
| Seoul Spice Roll | Fire chicken, jalapeño, cucumber | $14 | Meat, Spicy |
| Garden Roll | Avocado, sweet potato, pickled burdock root | $13 | Vegan |
| K-BBQ Fusion | Bulgogi beef, kimchi, toasted sesame | $16 | Meat |
| Sunrise Roll | Spam, egg, pickled daikon (musubi-style) | $13 | Gluten-Free |
| Tuna Crunch | Fresh ahi tuna, house gochujang aioli | $15 | Gluten-Free |
| Beast Mode | Double protein, no-rice keto option available | $17 | Meat, Gluten-Free |

## Dietary & Allergen Info
- **Vegan:** Garden Roll
- **Gluten-Free:** The Classic, Sunrise Roll, Tuna Crunch, Beast Mode
- **Meat options:** LA Galbi, Seoul Spice, K-BBQ Fusion, Beast Mode
- **Spicy:** Seoul Spice Roll (can note spice level preference)
- **Keto:** Beast Mode offers a no-rice option
- **Common allergens:** soy (most rolls), sesame (K-BBQ Fusion, some sauces), egg (Classic, Sunrise). If a customer has a severe allergy, advise them to contact hello@kroll-la.com before visiting.

## Ordering
Customers can visit in-person or order via the website. Online ordering is available. Walk-ins welcome. Catering inquiries: hello@kroll-la.com.

## What to say when you don't know something
If asked about something not covered above (e.g., parking, wait times, events), say you're not sure and suggest they contact hello@kroll-la.com or call (213) 555-ROLL for the most accurate answer.`;


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
