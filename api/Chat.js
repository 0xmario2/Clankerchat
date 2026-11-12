export default async function handler(req, res) {
  const { messages } = req.body;
  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: messages,
      temperature: 0.85,
      max_tokens: 250
    })
  });
  const data = await resp.json();
  res.json({ reply: data.choices[0].message.content });
}
