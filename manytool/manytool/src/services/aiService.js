/**
 * aiService.js
 * Dual mode:
 * 1. Production: Routes through secure server-side edge function (/api/groq)
 * 2. Localhost: Falls back to direct Groq API call using local .env key
 */

const prompts = {
  grammar: 'Correct the grammar of the following text and return only the corrected version.',
  summarize: 'Summarize the following text in 2 short sentences.',
  complexity: "Analyze the following text and provide a complexity score from 1 (very easy) to 10 (very complex). Return in this format: 'Score: [number] | Reason: [short explanation]'.",
  tone: 'Analyze the tone of the following text. Tell me if it is professional, casual, aggressive, or empathetic, and provide a short explanation.',
  suggestion: 'Suggest 3 key points the writer should add to improve and expand this text. Keep it concise.',
  layout: 'Generate a design-ready content structure with a Catchy Headline, Sub-headline, 2 bullet benefits, and CTA text.',
  promptPro: 'You are a world-class Prompt Engineer. Rewrite the following user text into a highly professional, structured, and detailed prompt with: 1. Persona 2. Task Instructions 3. Context 4. Constraints. Return only the final prompt.',
  multiLang: "Generate the same placeholder content in English and Hinglish. Format as 'English: [text]' and 'Hinglish: [text]'.",
  seoSlug: 'You are an SEO expert. Rewrite the input into a clean, short, URL-friendly slug. Lowercase. Use hyphens. Return ONLY the slug.',
  hierarchySlug: 'You are an SEO Architect. Create a logical URL hierarchy (e.g., /category/subcategory/title) for the input. Return ONLY the path starting with /.',
};

export const fetchGroqAI = async (text, task) => {
  // 1. Try secure /api/groq proxy first
  try {
    const response = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, task }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result) return data.result;
    }
  } catch (proxyErr) {
    // Proxy not available (e.g. running locally under plain Vite)
  }

  // 2. Local fallback if VITE_GROQ_API_KEY is available in .env
  const localKey = import.meta.env.VITE_GROQ_API_KEY;
  if (localKey) {
    try {
      const prompt = prompts[task] || 'Analyze and format the text.';
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: 'You are a high-speed text processing engine. Respond strictly with the requested output.' },
            { role: 'user', content: `${prompt}\n\nText: ${text}` },
          ],
          temperature: 0.2,
          max_tokens: 1024,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.choices?.[0]?.message?.content) {
        return resData.choices[0].message.content.trim();
      }
      throw new Error(resData.error?.message || 'Local Groq call failed');
    } catch (localErr) {
      console.error('Local Groq fetch error:', localErr);
      throw localErr;
    }
  }

  throw new Error('API key is not configured. Please set GROQ_API_KEY.');
};