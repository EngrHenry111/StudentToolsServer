import nodemailer from "nodemailer";

// Two ways to send, same `transporter.sendMail({ from, to, subject, html })`
// interface for every caller:
//
// - RESEND_API_KEY set → Resend's HTTPS API. Preferred in production:
//   cloud hosts (Render included) often block or throttle outbound SMTP,
//   which makes Gmail SMTP fail silently. `from` must be an address on a
//   domain verified in Resend — set EMAIL_FROM, e.g.
//   "StudentToolsNG <no-reply@studenttoolsng.com>".
// - otherwise → Gmail SMTP with EMAIL_USER / EMAIL_PASS (an App Password).

const gmailTransporter = nodemailer.createTransport({

 service: "gmail",

 auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
 },

});

const resendTransporter = {
  sendMail: async ({ to, subject, html, text, replyTo }) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Callers pass Gmail's EMAIL_USER as `from`; Resend can only send
        // from a verified domain, so EMAIL_FROM always wins here.
        from: process.env.EMAIL_FROM || "StudentToolsNG <onboarding@resend.dev>",
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {})
      })
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend API ${res.status}: ${body}`);
    }

    return res.json();
  }
};

const transporter = process.env.RESEND_API_KEY ? resendTransporter : gmailTransporter;

export default transporter;
