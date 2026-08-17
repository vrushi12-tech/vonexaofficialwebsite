const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEnquiryEmail = async (enquiry) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Client Enquiry - ${enquiry.name}`,
    html: `
      <h2>New Client Enquiry</h2>

      <p><strong>Name:</strong> ${enquiry.name}</p>
      <p><strong>Email:</strong> ${enquiry.email}</p>
      <p><strong>Phone:</strong> ${enquiry.phone}</p>
      <p><strong>Service:</strong> ${enquiry.service}</p>
      <p><strong>Message:</strong> ${enquiry.message}</p>
    `
  });
};

module.exports = sendEnquiryEmail;