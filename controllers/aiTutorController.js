import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export const askAITutor = async (req, res) => {

  try {

    const { question } = req.body;

    const completion = await groq.chat.completions.create({

      model: "llama-3.1-8b-instant",
      messages: [
        {
  
 role: "system",
 content: `
You are an AI tutor helping students learn programming, mathematics and physics.

Formatting rules:
- Always use Markdown formatting
- Use headings for titles
- Add a blank line after every heading
- Use bullet points for lists
- Use code blocks for programming examples
- Separate paragraphs with blank lines

Make answers clean and easy to read.
`
},
        {
          role: "user",
          content: question
        }
      ]

    });

// convert line breaks to paragraph spacing
let answer = completion.choices[0].message.content;

// Ensure spacing after headings
answer = answer.replace(/\*\*(.*?)\*\*/g, "\n\n**$1**\n\n");

res.json({
 answer
});
} catch (error) {

    console.error("GROQ ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};

