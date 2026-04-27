import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";


const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1" 
});

export const askTutorialAI = async (req,res)=>{

 try{

  const {question, tutorialContent} = req.body;

  const completion = await groq.chat.completions.create({

   model: "llama-3.1-8b-instant",

   messages: [
    {
  role: "system",
  content: `
You are an AI tutor helping students learn mathematics, physics, programming and engineering.

Rules:
- Explain clearly for beginners
- Use short paragraphs
- Add spacing between paragraphs
- Use bullet points when helpful
- Avoid long blocks of text
`
},

    {
     role:"user",
     content:`
Tutorial Content:
${tutorialContent}

Student Question:
${question}

Explain clearly for a beginner.
`
    }

   ]

  });

  res.json({
   answer: completion.choices[0].message.content
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};

