// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  console.log(transporter);
  // 2) define the email options

  const htmlmessage = `
<html>
  <head>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f9f9f9;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: white;
      }
      .btn {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: white;
        background-color: #007BFF;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      .btn:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Forgot your password? Click the button below to reset it:</p>
      <p><a href="${options.resetURL}" class="btn">Reset Your Password</a></p>
      <p>If you didn't forget your password, please ignore this email.</p>
      <p>Best regards,<br>The Support Team</p>
    </div>
  </body>
</html>
`;

  const mailOptions = {
    from: 'Teodora Vestale <vestale.teodora@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: htmlmessage,
  };
  console.log(mailOptions);
  // 3) send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
