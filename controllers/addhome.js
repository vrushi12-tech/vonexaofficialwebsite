const Enquiry = require("../models/Enquiry");
const ExcelJS = require('exceljs');
const sendEnquiryEmail = require('../utils/email');
exports.getHome = (req, res, next) => {
  (require("../models/review")).fetchAll((allReviews) => {
    const reviews = allReviews.slice(0, 3);
    const avgRating = allReviews.length
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length)
      : 0;

    res.render('home', {
      reviews: reviews,
      avgRating: avgRating,
      reviewCount: allReviews.length,
      pageTitle: "Vonexa | Digital Solutions for Every Business"
    });
  });
};

exports.getPricing = (req, res, next) => {
  (require("../models/service")).fetchAll((dynamicServices) => {
    res.render('pricing', {
      dynamicServices: dynamicServices,
      pageTitle: "Vonexa | Pricing"
    });
  });
};
 
exports.getRegisteredHomes = (req, res, next) => {
  (require("../models/home")).fetchAll((services) => {
    (require("../models/review")).fetchAll((allReviews) => {
      (require("../models/service")).fetchAll((plans) => {
        const reviews = allReviews.slice(0, 3);
        const avgRating = allReviews.length
          ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length)
          : 0;
 
        res.render('store/favourite-list', {
          services: services,
          plans: plans,
          reviews: reviews,
          avgRating: avgRating,
          reviewCount: allReviews.length,
          pageTitle: "Homes"
        });
      });
    });
  });
};
 

// exports.getRegisteredHomes = (req, res, next) => {
//   (require("../models/home")).fetchAll((services) => {
//     (require("../models/review")).fetchAll((allReviews) => {
//       const reviews = allReviews.slice(0, 3);
//       const avgRating = allReviews.length
//         ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length)
//         : 0;

//       res.render('store/favourite-list', {
//         services: services,
//         reviews: reviews,
//         avgRating: avgRating,
//         reviewCount: allReviews.length,
//         pageTitle: "Homes"
//       });
//     });
//   });
// };

exports.getAddHome = (req, res, next) => {
  res.render('enquiry', { pageTitle: "Enquire" });
};

// const sendEnquiryEmail = require("../utils/email");

exports.postAddHome = (req, res, next) => {
  const { name, phone, email, package, message } = req.body;
  console.log("Enquiry form data received:", req.body);
  const enquiry = new (require("../models/enquiry"))(
    name,
    phone,
    email,
    package,
    message
  );
  enquiry
    .save()
    .then((result) => {
      console.log("Enquiry saved successfully:", result.insertedId);

      // Fire-and-forget: don't make the customer wait for the email to
      // actually send. We respond as soon as the DB save is done, and
      // let the email happen in the background.
      sendEnquiryEmail({
        name,
        phone,
        email,
        service: package,
        message
      })
        .then(() => console.log("Enquiry email sent successfully"))
        .catch((emailError) => console.error("EMAIL ERROR:", emailError));

      res.render("enquiry-success", {
        pageTitle: "Enquiry Sent Successfully"
      });
    })
    .catch((err) => {
      console.log("ERROR saving enquiry:", err);
      res.render("enquiry-success", {
        pageTitle: "Enquiry Sent Successfully"
      });
    });
};
exports.getAllEnquiries = (req, res, next) => {
  (require("../models/enquiry")).fetchAll((allEnquiries) => {
    const activeStatus = req.query.status || 'All';
    const enquiries = activeStatus === 'All'
      ? allEnquiries
      : allEnquiries.filter((e) => e.status === activeStatus);

    res.render('host/enquiries', {
      enquiries: enquiries,
      allEnquiries: allEnquiries,
      activeStatus: activeStatus,
      pageTitle: "Enquiries"
    });
  });
};

exports.updateEnquiryStatus = (req, res, next) => {
  const enquiryId = req.params.enquiryId;
  const { status } = req.body;

  (require("../models/enquiry")).updateById(enquiryId, { status: status }, () => {
    res.redirect('/enquiries');
  });
};

exports.exportEnquiries = (req, res, next) => {
  (require("../models/enquiry")).fetchAll((allEnquiries) => {
    const activeStatus = req.query.status || 'All';
    const enquiries = activeStatus === 'All'
      ? allEnquiries
      : allEnquiries.filter((e) => e.status === activeStatus);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Enquiries');

    sheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Package', key: 'package', width: 25 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Message', key: 'message', width: 45 },
      { header: 'Submitted On', key: 'createdAt', width: 22 }
    ];

    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
    });

    enquiries.forEach((e) => {
      sheet.addRow({
        name: e.name || '',
        phone: e.phone || '',
        email: e.email || '',
        package: e.package || '',
        status: e.status || 'Pending',
        message: e.message || '',
        createdAt: e.createdAt ? new Date(e.createdAt).toLocaleString() : ''
      });
    });

    sheet.autoFilter = { from: 'A1', to: 'G1' };

    const filename = `vonexa-enquiries-${activeStatus.toLowerCase()}-${Date.now()}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    workbook.xlsx.write(res)
      .then(() => res.end())
      .catch((err) => {
        console.log('Export error:', err);
        res.redirect('/enquiries');
      });
  });
};

exports.getAddClient = (req, res, next) => {
  res.render('host/add-client', { pageTitle: "Add Completed Client" });
};

exports.postAddClient = (req, res, next) => {
  const { name, phone, email, package: packageName, amount, completedOn, notes } = req.body;

  const client = new (require("../models/client"))(
    name,
    phone,
    email,
    packageName,
    amount,
    completedOn,
    notes
  );

  client
    .save()
    .then(() => {
      res.redirect('/revenue');
    })
    .catch((err) => {
      console.log('ERROR saving completed client:', err);
      res.redirect('/revenue/add');
    });
};

exports.getRevenue = (req, res, next) => {
  (require("../models/client")).fetchAll((clients) => {
    const totalRevenue = clients.reduce((sum, c) => sum + (c.amount || 0), 0);

    const now = new Date();
    const monthRevenue = clients
      .filter((c) => c.completedOn &&
        new Date(c.completedOn).getMonth() === now.getMonth() &&
        new Date(c.completedOn).getFullYear() === now.getFullYear())
      .reduce((sum, c) => sum + (c.amount || 0), 0);

    const avgDeal = clients.length ? Math.round(totalRevenue / clients.length) : 0;

    res.render('host/revenue', {
      clients: clients,
      totalRevenue: totalRevenue,
      monthRevenue: monthRevenue,
      avgDeal: avgDeal,
      pageTitle: "Revenue"
    });
  });
};

exports.deleteClient = (req, res, next) => {
  (require("../models/client")).deleteById(req.params.clientId, () => {
    res.redirect('/revenue');
  });
};

exports.exportRevenue = (req, res, next) => {
  (require("../models/client")).fetchAll((clients) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Revenue');

    sheet.columns = [
      { header: 'Client Name', key: 'name', width: 25 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Package Taken', key: 'package', width: 25 },
      { header: 'Amount Charged (₹)', key: 'amount', width: 20 },
      { header: 'Completed On', key: 'completedOn', width: 18 },
      { header: 'Notes', key: 'notes', width: 40 }
    ];

    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } };
    });

    let total = 0;

    clients.forEach((c) => {
      total += c.amount || 0;
      sheet.addRow({
        name: c.name || '',
        phone: c.phone || '',
        email: c.email || '',
        package: c.package || '',
        amount: c.amount || 0,
        completedOn: c.completedOn ? new Date(c.completedOn).toLocaleDateString() : '',
        notes: c.notes || ''
      });
    });

    const totalRow = sheet.addRow({
      name: '',
      phone: '',
      email: '',
      package: 'TOTAL',
      amount: total,
      completedOn: '',
      notes: ''
    });
    totalRow.font = { bold: true };
    totalRow.getCell('package').font = { bold: true };
    totalRow.getCell('amount').font = { bold: true, color: { argb: 'FF059669' } };

    sheet.getColumn('amount').numFmt = '₹#,##0';
    sheet.autoFilter = { from: 'A1', to: 'G1' };

    const filename = `vonexa-revenue-${Date.now()}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    workbook.xlsx.write(res)
      .then(() => res.end())
      .catch((err) => {
        console.log('Export error:', err);
        res.redirect('/revenue');
      });
  });
};

exports.getReviews = (req, res, next) => {
  (require("../models/review")).fetchAll((reviews) => {
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
      : 0;

    res.render('store/reviews', {
      reviews: reviews,
      avgRating: avgRating,
      pageTitle: "Vonexa | Client Reviews"
    });
  });
};

exports.postReview = (req, res, next) => {
  const { name, rating, package: packageName, message } = req.body;

  const review = new (require("../models/review"))(
    name,
    rating,
    packageName,
    message
  );

  review
    .save()
    .then(() => {
      res.render('review-success', { pageTitle: "Thank You" });
    })
    .catch((err) => {
      console.log('ERROR saving review:', err);
      res.redirect('/reviews');
    });
};

exports.deleteReview = (req, res, next) => {
  (require("../models/review")).deleteById(req.params.reviewId, () => {
    res.redirect('/manage-reviews');
  });
};

exports.getManageReviews = (req, res, next) => {
  (require("../models/review")).fetchAll((reviews) => {
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
      : 0;

    res.render('host/manage-reviews', {
      reviews: reviews,
      avgRating: avgRating,
      pageTitle: "Manage Reviews"
    });
  });
};

exports.postAdminAddReview = (req, res, next) => {
  const { name, rating, package: packageName, message } = req.body;

  const review = new (require("../models/review"))(
    name,
    rating,
    packageName,
    message
  );

  review
    .save()
    .then(() => {
      res.redirect('/manage-reviews');
    })
    .catch((err) => {
      console.log('ERROR saving review:', err);
      res.redirect('/manage-reviews');
    });
};



