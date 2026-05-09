import Message from "../models/messageModel.js";
import transporter from "../config/mailer.js";

export const sendMessage = async (req, res) => {

 try {

  const { name, email, message } = req.body;

  // ✅ VALIDATION
  if (!name || !email || !message) {

   return res.status(400).json({
    success: false,
    message: "All fields are required"
   });

  }

  // ✅ SAVE MESSAGE TO DATABASE
  const newMessage = await Message.create({
   name,
   email,
   message
  });

  console.log("✅ Message saved to database");

  // ✅ SEND EMAIL (SAFE MODE)
  try {

   await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: process.env.EMAIL_USER,

    subject: "New Contact Message - StudentToolsNG",

    html: `
     <div style="font-family:Arial,sans-serif;padding:20px;">
     
      <h2 style="color:#2563eb;">
       New Contact Message
      </h2>

      <p>
       <strong>Name:</strong> ${name}
      </p>

      <p>
       <strong>Email:</strong> ${email}
      </p>

      <p>
       <strong>Message:</strong>
      </p>

      <div style="
       background:#f3f4f6;
       padding:15px;
       border-radius:8px;
       line-height:1.6;
      ">
       ${message}
      </div>

     </div>
    `

   });

   console.log("✅ Email sent successfully");

  } catch (mailError) {

   // ✅ EMAIL FAILURE WILL NOT BREAK APP
   console.log("❌ Email sending failed:");
   console.log(mailError.message);

  }

  // ✅ SUCCESS RESPONSE
  res.status(201).json({

   success: true,

   message: "Message sent successfully",

   data: newMessage

  });

 } catch (error) {

  console.error("❌ CONTROLLER ERROR:");
  console.error(error);

  res.status(500).json({

   success: false,

   message: error.message || "Server Error"

  });

 }

};


/* ================= GET ALL MESSAGES ================= */
export const getMessages = async (req, res) => {

 try {

  const messages = await Message.find().sort({ createdAt: -1 });

  res.status(200).json(messages);

 } catch (error) {

  console.log(error);

  res.status(500).json({
   success: false,
   message: error.message
  });

 }

};


/* ================= DELETE MESSAGE ================= */
export const deleteMessage = async (req, res) => {

 try {

  const { id } = req.params;

  const deletedMessage = await Message.findByIdAndDelete(id);

  if (!deletedMessage) {

   return res.status(404).json({
    success: false,
    message: "Message not found"
   });

  }

  res.status(200).json({
   success: true,
   message: "Message deleted successfully"
  });

 } catch (error) {

  console.log(error);

  res.status(500).json({
   success: false,
   message: error.message
  });

 }

};