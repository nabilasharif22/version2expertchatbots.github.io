/**
 * openaiChat.js
 * GitHub Pages Function
 * Calls OpenAI to generate a reply impersonating Expert A.
 * The evidence-only constraint is enforced primarily via the prompt sent from the front end.
 */

export async function onRequestPost(context) {
  const body = await context.request.json();
  const { prompt } = body;

  const apiKey = context.env.OPENAI_API_KEY;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a careful expert impersonator. Follow the user's instructions exactly, especially about citing only real papers authored or referenced by the expert."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.4
    })
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";

  return Response.json({ text });
}
