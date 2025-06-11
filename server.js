import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/bilbo", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Ingen prompt skickad." });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "openrouter/deepseek-chat",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "Inget svar från AI." });
  } catch (error) {
    console.error("Fel i /bilbo-endpoint:", error);
    res.status(500).json({ error: "Serverfel." });
  }
});

app.listen(PORT, () => console.log(`Bilbo-backend igång på port ${PORT}`));
