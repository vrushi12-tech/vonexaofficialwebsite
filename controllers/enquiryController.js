const Enquiry = require('../models/Enquiry');

exports.getEnquiryPage = (req, res) => {
  res.render('enquiry', {
    pageTitle: 'Enquire | Vonexa'
  });
};

exports.postEnquiry = (req, res) => {
  const { name, phone, email, package: packageName, message } = req.body;

  const enquiry = new Enquiry(name, phone, email, packageName, message);

  enquiry
    .save()
    .then(() => {
      res.redirect('/enquiry-success');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/enquiry');
    });
};

// Optional: admin view to list all enquiries
exports.getAllEnquiries = (req, res) => {
  Enquiry.fetchAll((enquiries) => {
    res.render('./node course/views/host/enquiry', {
      enquiries,
      pageTitle: 'All Enquiries'
    });
  });
};
