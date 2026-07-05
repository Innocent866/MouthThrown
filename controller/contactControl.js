const sendEmail = require('../helpers/sendMail');

// Contact-us: forwards the visitor's message to the store inbox by e-mail
const contact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'name, email and message are required' });
  }
  try {
    sendEmail({
      to: process.env.EMAIL_FROM,
      subject: `MouthThrown contact from ${name} <${email}>`,
      text: message,
    });
    res.status(200).json({ success: true, message: "Message sent — we'll reply to your e-mail shortly" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { contact };
