import { createTransport } from "nodemailer";
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `DevConnect" <no-reply@devconnect.com>`,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
