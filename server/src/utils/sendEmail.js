import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error(
        "Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file"
      );
    }

    const mailOptions = {
      from: `DevConnect <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;
