const express = require('express');
const router = express.Router();

const enquiryController = require('../controllers/enquiryController');

// GET /enquiry -> renders the enquiry form (views/enquiry.ejs)
router.get('/enquiry', enquiryController.getEnquiryPage);

// POST /enquiry -> saves the submission (matches form's action="/enquiry" method="POST")
router.post('/enquiry', enquiryController.postEnquiry);

module.exports = router;
