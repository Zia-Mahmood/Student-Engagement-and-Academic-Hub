const nodemailer = require('nodemailer');

// Create a transporter using your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Function to send email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
