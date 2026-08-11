const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: '"MLBench Ecommerce" <no-reply@mlbench.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;