/**
 * Vercel Edge Function — Groq AI Proxy
 * Keeps the Groq API key server-side, never exposed to browser.
 * Route: /api/groq (called from aiService.js)
 */
export const config = { runtime: 'edge' };

const ALLOWED_ORIGIN = 'https://manytool.in';

export default async function handler(req) {
  // CORS — allow only manytool.in in production
  const origin = req.headers.get('origin') || '';
  const isAllowed = origin === ALLOWED_ORIGIN || origin.includes('localhost') || origin.includes('vercel.app');

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
  }

  try {
    const body = await req.json();
    const { text, task } = body;

    if (!text || !task) {
      return new Response(JSON.stringify({ error: 'Missing text or task' }), { status: 400 });
    }

    const prompts = {
      grammar: 'Correct the grammar of the following text and return only the corrected version.',
      summarize: 'Summarize the following text in 2 short sentences.',
      complexity: "Analyze the following text and provide a complexity score from 1 (very easy) to 10 (very complex). Return in this format: 'Score: [number] | Reason: [short explanation]'.",
      tone: 'Analyze the tone of the following text. Tell me if it is professional, casual, aggressive, or empathetic, and provide a short explanation.',
      suggestion: 'Suggest 3 key points the writer should add to improve and expand this text. Keep it concise.',
      layout: 'Generate a design-ready content structure with a Catchy Headline, Sub-headline, 2 bullet benefits, and CTA text.',
      promptPro: 'You are a world-class Prompt Engineer. Rewrite the following user text into a highly professional, structured, and detailed prompt with: 1. Persona 2. Task Instructions 3. Context 4. Constraints. Return only the final prompt.',
      multiLang: "Generate the same placeholder content in English and Hinglish. Format as 'English: [text]' and 'Hinglish: [text]'.",
      seoSlug: "You are an SEO expert. Rewrite the input into a clean, short, URL-friendly slug. Lowercase. Use hyphens. Return ONLY the slug.",
      hierarchySlug: "You are an SEO Architect. Create a logical URL hierarchy (e.g., /category/subcategory/title) for the input. Return ONLY the path starting with /.",
    };

    const systemPrompt = prompts[task];
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: 'Unknown task type' }), { status: 400 });
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Be concise and accurate.' },
          { role: 'user', content: `${systemPrompt}\n\n${text}` },
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error('Groq API Error:', data);
      return new Response(JSON.stringify({ error: data.error?.message || 'Groq API error' }), { status: 502 });
    }

    const result = data.choices?.[0]?.message?.content || '';
    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGIN,
      },
    });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
