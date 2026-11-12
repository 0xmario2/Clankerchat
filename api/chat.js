export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { messages } = req.body;
    
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(200).json({ reply: "GROQ_API_KEY not set in Vercel Settings" });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(200).json({ reply: "No messages sent" });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are Clanker. Grey body, red ears, Base chain mascot. You are funny, degen, casual, use crypto slang. Keep answer short, max 2-3 sentences. Never say you are AI. You talk about $CLANKERCHAT."
          },
          ...messages
        ],
        temperature: 0.9,
        max_tokens: 300,
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      console.log("Groq error:", data);
      return res.status(200).json({ reply: `Groq API Error: ${data.error?.message || JSON.stringify(data)}` });
    }

    const reply = data.choices?.[0]?.message?.content;
    
    if (!reply) {
      return res.status(200).json({ reply: "Groq gave empty response" });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(200).json({ reply: "Server error: " + err.message });
  }
}
