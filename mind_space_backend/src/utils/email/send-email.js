import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"mind-space" <${process.env.email}>`, // sender address
    to, // list of receivers
    subject,
    html,
  });

  if (info.rejected.length > 0) {
    return false;
  }
  return true;
};
