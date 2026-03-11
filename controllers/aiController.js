import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

// const openai = new OpenAI({
//  apiKey: process.env.OPENAI_API_KEY
// });

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




// import dotenv from "dotenv";
// dotenv.config();

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export const askTutorialAI = async (req, res) => {

//   try {

//     const { question } = req.body;

//     if (!question) {
//       return res.status(400).json({ message: "Question is required" });
//     }

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: "You are an academic tutor helping students learn physics, math, and programming."
//         },
//         {
//           role: "user",
//           content: question
//         }
//       ]
//     });

//     const answer = completion.choices[0].message.content;

//     res.json({ answer });

//   } catch (error) {

//     console.error("AI ERROR:", error);

//     res.status(500).json({
//       message: "AI request failed",
//       error: error.message
//     });

//   }
// };