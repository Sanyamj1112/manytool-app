export const fetchGroqAI = async (text, task) => {
  const GROQ_API_KEY = import.meta.env.VITEgsk_ZXM8bC8MPUnuNxZjbQOhWGdyb3FYKrmwcU5A3JIMIw0oY5RsddzW;
  const prompts = {
    grammar: "Correct the grammar of the following text and return only the corrected version.",
    summarize: "Summarize the following text in 2 short sentences.",
    complexity: "Analyze the following text and provide a complexity score from 1 (very easy) to 10 (very complex). Return the response in this format: 'Score: [number] | Reason: [short explanation].",
    tone: "Analyze the tone of the following text. Tell me if it is professional, casual, aggressive, or empathetic, and provide a short explanation.",
    suggestion: "I have a word count goal of [target] words, but my current text is [current] words. Suggest 3 key points I should add to reach the target. Keep it concise.",
    hinglish: "Rewrite the following text in simple, readable Hinglish (a natural mix of Hindi and English) that is easy for university students to understand. Keep technical terms as they are.",
    layout: "Generate a design-ready content structure with a Catchy Headline, a descriptive Sub-headline, 2 bullet points highlighting key benefits, and a short, persuasive Call to Action (CTA) button text. Format it clearly.",
    promptPro: "You are a world-class Prompt Engineer. Rewrite the following user text into a highly professional, structured, and detailed prompt. Ensure the prompt includes: 1. A defined Persona, 2. Clear Task Instructions, 3. Context, 4. Constraints. Return only the final optimized prompt.",
    multiLang: "Generate the same placeholder content in both English and Hinglish. Format it clearly as 'English: [text]' and 'Hinglish: [text]'. This is for design layout testing.",
    seoSlug: "You are an SEO expert. Rewrite the input into a clean, short, URL-friendly slug. Remove all stop words. Keep it lowercase. Use hyphens. IMPORTANT: Return ONLY the final slug string, no explanations, no suggestions, no extra text. Example Input: '10 Best Ways To Lose Weight'. Example Output: 'best-ways-lose-weight'.",
    hierarchySlug: "You are an SEO Architect. Create a logical URL hierarchy (e.g., /category/subcategory/title) for the provided input. IMPORTANT: Return ONLY the path starting with a forward slash. No intros, no explanations, no 'Here is your slug', no conversational text. Example input: 'Best Hiking Boots for Men'. Example output: '/products/men/hiking-boots'."
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", // Yahan yeh naam dalo kyunki nayi key active hai
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: `${prompts[task]}: ${text}` }
        ]
      })
    });

    const data = await response.json();

    // Agar error response aaye toh console mein check kar
    if (!response.ok) {
      console.error("Groq API Error Details:", data);
      throw new Error(data.error?.message || "Something went wrong");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};