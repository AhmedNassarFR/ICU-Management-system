require('dotenv').config();
const nodemailer = require("nodemailer");

async function main() {
  try {
    let transporter = nodemailer.createTransport({
      service:"gmail",
      port: 465,
      logger: true,
      debug: true,
      secureConnection: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
      tls:{
        rejectUnauthorized:true
      }
    });

    let info = await transporter.sendMail({
      from: 'OpenJavaScript <' + process.env.EMAIL_USER + '>',
      to: "an.technology14@gmail.com",
      subject: "Testing, testing, 123",
      html: `
        <h1>Hello there</h1>
        <p>40/40 ان شاء الله</p>
      `,
    });

    console.log(`Message sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }
}

main();
