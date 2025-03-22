import Contact from '../models/contactModel.js';
import nodemailer from 'nodemailer';

const sendEmail = async (toEmail, name) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
    tls: { rejectUnauthorized: false }, // Bypass SSL errors (for testing)
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Thank you for contacting us!',
    text: `Dear ${name},\n\nThank you for reaching out. We'll get back to you soon!\n\nBest regards,\nThe Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail}`);
  } catch (error) {
    console.error('Email Error:', error.message);
    throw new Error('Failed to send email. Check your credentials.');
  }
};

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contactMessage = new Contact({ name, email, phone, message });
    await contactMessage.save();
    await sendEmail(email, name);
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all contact messages (for admin)
export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find({});
    res.json({ success: true, messages });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

