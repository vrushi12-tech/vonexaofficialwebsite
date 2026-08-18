const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEnquiryEmail = async (enquiry) => {
  const { data, error } = await resend.emails.send({
    from: "Vonexa <team@vonexa.in>",
    to: ["team@vonexa.in"],
    replyTo: enquiry.email,
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

  if (error) {
    throw new Error(error.message);
  }

  console.log("Resend email ID:", data.id);
  return data;
};

module.exports = sendEnquiryEmail;
