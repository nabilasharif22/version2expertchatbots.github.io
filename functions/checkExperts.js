/**
 * checkExperts.js
 * GitHub Pages Function
 * Validates that each expert has published papers using Semantic Scholar.
 */

export async function onRequestPost(context) {
  const body = await context.request.json();
  const { expertA, expertB } = body;

  async function getCount(name) {
    const url = `https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(
      name
    )}&fields=paperCount&limit=1`;

    const res = await fetch(url);
    const data = await res.json();
    return data.data?.[0]?.paperCount || 0;
  }

  const countA = await getCount(expertA);
  const countB = await getCount(expertB);

  if (countA === 0 || countB === 0) {
    return new Response(
      JSON.stringify({
        error: "One or both experts have no published papers.",
        details: { [expertA]: countA, [expertB]: countB }
      }),
      { status: 400 }
    );
  }

  return Response.json({ ok: true });
}
