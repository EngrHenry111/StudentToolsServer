import Message from "../models/messageModel.js";
import transporter from "../config/mailer.js";

export const sendMessage = async (req,res)=>{

 try{

  console.log("BODY:", req.body);

  const {name,email,message} = req.body;

  if(!name || !email || !message){

   return res.status(400).json({
    message:"All fields are required"
   });

  }

  const newMessage = await Message.create({
   name,
   email,
   message
  });

  console.log("MESSAGE SAVED");

  await transporter.sendMail({
   from: process.env.EMAIL_USER,
   to: process.env.EMAIL_USER,
   subject: "New Contact Message - StudentToolsNG",
   html: `
    <h3>New Contact Message</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
   `
  });

  console.log("EMAIL SENT");

  res.status(201).json({
   success:true,
   data:newMessage
  });

 }catch(error){

  console.error("MESSAGE ERROR:", error);

  res.status(500).json({
   message:error.message
  });

 }

};