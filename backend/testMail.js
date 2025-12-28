require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'rushkakhanal4@gmail.com',
  subject: 'Test Mail',
  text: 'If you got this, nodemailer works',
})
.then(() => console.log('Email sent'))
.catch(err => console.error(err));
