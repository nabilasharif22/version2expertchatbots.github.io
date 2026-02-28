/**
 * claudeChat.js
 * GitHub Pages Function
 * Calls Anthropic Claude to generate a reply impersonating Expert B.
 * The evidence-only constraint is enforced primarily via the prompt sent from the front end.
 */

export async function onRequestPost(context) {
  const body = await context.request.json();
  const { prompt } = body;

  const apiKey = context.env.ANTHROPIC_API_KEY;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 600,
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();
  const text = data.content?.[0]?.text || "";

  return Response.json({ text });
}
