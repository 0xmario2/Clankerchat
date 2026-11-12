export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { messages } = req.body;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(200).json({ reply: "GROQ_API_KEY not set" });
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "system", content: "You are Clanker, grey body red ears, mascot ClankerChat on Base. Funny degen helpful. Reply short 2-3 sentences. If user Indonesian reply Indonesian gaul. CA 0xbC45c8F9ad04eddd633930fDA595dd8791D3ccCC" }, ...messages],
        temperature: 0.85,
        max_tokens: 400
      })
    });
    const data = await groqRes.json();
    if (!groqRes.ok) return res.status(200).json({ reply: "Groq Error: " + (data.error?.message || JSON.stringify(data)) });
    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (e) { return res.status(200).json({ reply: "Error: " + e.message }); }
}
