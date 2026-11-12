export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { messages } = req.body;
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return res.status(200).json({ reply: "GROQ_API_KEY belum di set di Vercel" });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: "You are Clanker, the mascot of ClankerChat. You have grey body, big red ears. You live on Base chain. You are funny, degen, friendly, slightly chaotic but helpful. You love talking about $CLANKERCHAT token. Use slang like 'wagmi', 'gm', 'based'. Keep replies short 2-3 sentences max. Never mention you are an AI model."
          },
          ...messages
        ],
        temperature: 0.9,
        max_tokens: 400
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      return res.status(200).json({ reply: `Groq Error: ${data.error?.message || JSON.stringify(data).slice(0,300)}` });
    }

    const reply = data.choices?.[0]?.message?.content || "Clanker is sleeping...";
    return res.status(200).json({ reply });

  } catch (err) {
   
