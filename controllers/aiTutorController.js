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

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export const askAITutor = async (req, res) => {
//   try {

//     const { question } = req.body;

//     if (!question) {
//       return res.status(400).json({
//         message: "Question is required"
//       });
//     }

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an AI tutor helping students understand mathematics, physics, programming, and engineering."
//         },
//         {
//           role: "user",
//           content: question
//         }
//       ]
//     });

//     const answer = response.choices[0].message.content;

//     res.json({ answer });

//   } catch (error) {

//     console.error("AI TUTOR ERROR:", error);

//     res.status(500).json({
//       message: "AI tutor failed",
//       error: error.message
//     });

//   }
// };

// import dotenv from "dotenv";
// dotenv.config();
// import OpenAI from "openai";

// const openai = new OpenAI({
//  apiKey: process.env.OPENAI_API_KEY
// });

// export const askAITutor = async (req,res)=>{

//  try{

//   const {question} = req.body;

//   const completion = await openai.chat.completions.create({

//    model:"gpt-4o-mini",

//    messages:[

//     {
//      role:"system",
//      content:`
// You are an AI tutor for a learning platform called StudentToolsNG.

// You help students understand:
// - Mathematics
// - Physics
// - Programming
// - Engineering concepts

// Explain clearly and step-by-step.
// `
//     },

//     {
//      role:"user",
//      content:question
//     }

//    ]

//   });

//   res.json({
//    answer:completion.choices[0].message.content
//   });

//  }catch(error){

//   res.status(500).json({
//    message:error.message
//   });

//  }

// };