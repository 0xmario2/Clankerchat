export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { messages } = req.body;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ reply: "GROQ_API_KEY not set" });
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", messages, temperature: 0.85, max_tokens: 300 })
    });
    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content || "Clanker error";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ reply: "Error: " + err.message });
  }
}
