require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const mailer = async (email) => {
  const info = await transporter.sendMail({
    from: '"Sujan Tamang" <suzanyba079@gmail.com',
    to: email, // list of receivers
    subject: "Status", // Subject line
    html: "<b>User Signup Successful</b>",
  });

  return info.messageId;
};

module.exports = { mailer };
