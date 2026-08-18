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


const sendClientConfirmationEmail = async (enquiry) => {
  const { data, error } = await resend.emails.send({
    from: "Vonexa <team@vonexa.in>",
    to: [enquiry.email],

    subject: "We received your enquiry — Vonexa",

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">

        <h2>Thank you for contacting Vonexa!</h2>

        <p>Hi ${enquiry.name},</p>

        <p>
          Thank you for reaching out to <strong>Vonexa</strong>.
          We have successfully received your enquiry.
        </p>

        <p>
          Our team will review your requirements and get back to you soon.
        </p>

        <hr>

        <h3>Your Enquiry</h3>

        <p>
          <strong>Service:</strong> ${enquiry.service}
        </p>

        <p>
          <strong>Phone:</strong> ${enquiry.phone}
        </p>

        <p>
          <strong>Message:</strong><br>
          ${enquiry.message}
        </p>

        <hr>

        <p>
          Regards,<br>
          <strong>Team Vonexa</strong><br>
          team@vonexa.in
        </p>

      </div>
    `
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};


module.exports = {
  sendEnquiryEmail,
  sendClientConfirmationEmail
}
