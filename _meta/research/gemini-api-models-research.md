# Gemini API Model Names Research

**Date:** March 2026  
**Topic:** Exact model IDs for Google Generative Language API v1beta generateContent endpoint

---

## Critical Pitfall: v1beta is NOT Production

**Pitfall 1: v1beta has breaking changes**
- The v1beta API "includes early features that may be under development and are subject to breaking changes"
- No guarantee that v1beta features move to stable v1
- **Fix:** Use `v1` endpoint for production (`https://generativelanguage.googleapis.com/v1/models/...`), NOT `v1beta`
- v1beta is for experimentation only

**Pitfall 2: Model availability varies by API version**
- Not all models listed in pricing are available in v1beta
- Users report 404 errors on newer models (gemini-2.5-flash, gemini-3.x) in v1beta
- **Fix:** Either (a) migrate to v1, or (b) call the ListModels endpoint to verify model availability for your API version
- Python example: `for m in client.models.list(): for action in m.supported_actions: if action == "generateContent": print(m.name)`

**Pitfall 3: gemini-1.5-flash-8b may not exist in v1beta**
- Search results mention `gemini-1.5-flash-8b` as existing, but no v1beta examples found
- Likely available in v1 only
- **Fix:** Test the model name first; if 404 occurs, fall back to documented stable models

---

## Correct Model Names for generateContent

### If using **v1** (RECOMMENDED for production)

**Free-tier text/multimodal models:**
- `gemini-3.1-flash-lite-preview` (fastest, free input/output)
- `gemini-3-flash-preview` (good balance, free)
- `gemini-2.5-flash` (popular, free)
- `gemini-2.5-flash-lite` (lightweight, free)
- `gemini-2.0-flash` (deprecated March 2026, shutdown Sept 2026)

**Endpoint format:**
```
https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
```

**Recommended model for free tier:** `gemini-2.5-flash` — best balance of cost, performance, and availability.

### If using **v1beta** (experimentation only)

**Confirmed available models:**
- `gemini-2.0-flash` (oldest stable, available in v1beta)
- `gemini-2.0-flash-lite`
- Possibly `gemini-1.5-flash` and `gemini-1.5-pro` (legacy, not recommended)

**Endpoint format:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

**Not guaranteed in v1beta:**
- `gemini-2.5-flash` (may not exist in v1beta; 404 errors reported)
- `gemini-2.5-flash-lite`
- `gemini-3.x` series (preview models not available in v1beta)
- `gemini-1.5-flash-8b` (exists somewhere, but no v1beta examples found)

---

## Determining Available Models at Runtime

**Recommended approach:** Call ListModels endpoint to get the authoritative list.

**Python example:**
```python
from google.generativeai.types import model_types

# List all models and filter to generateContent
for model in client.models.list():
    if "generateContent" in model.supported_methods:
        print(f"Model: {model.name}")
```

**REST API (curl):**
```bash
curl -s "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY" \
  | jq '.models[] | select(.supportedGenerationMethods[] | contains("generateContent")) | .name'
```

---

## Free Tier Limits (as of March 2026)

| Model | Requests/min | Tokens/min | Requests/day |
|-------|--------------|-----------|--------------|
| gemini-2.5-flash | 10 | 250,000 | 250 |
| gemini-2.5-flash-lite | 15 | 250,000 | 1,000 |
| gemini-2.0-flash | 5 | 250,000 | 100 |

---

## Recommended Solution

**For your use case:**

1. **Production (stable):** Use `v1` API with `gemini-2.5-flash`
   ```
   https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
   ```

2. **Experimentation:** Use `v1beta` with `gemini-2.0-flash` (safest bet in beta)
   ```
   https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
   ```

3. **If gemini-1.5-flash-8b is required:** Call ListModels first to determine which API version supports it (likely v1 only).

---

## Sources

- [Gemini API Pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
- [API Versions Explained — Google AI for Developers](https://ai.google.dev/gemini-api/docs/api-versions)
- [Models — Google AI for Developers](https://ai.google.dev/api/models)
- [Generating Content — Google AI for Developers](https://ai.google.dev/api/generate-content)
- [Gemini API Free Tier 2026 Guide](https://blog.laozhang.ai/en/posts/gemini-api-free-tier)
- [Gemini 1.5 Flash-8B Release — Google Developers Blog](https://developers.googleblog.com/en/gemini-15-flash-8b-is-now-generally-available-for-use/)
