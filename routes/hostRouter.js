const express = require('express');
const hostRouter = express.Router();
const path = require('path');
const addHomeController = require('../controllers/addhome');
const hostcontroller = require('../controllers/host');
const serviceController = require('../controllers/serviceController');
const isAuth = require('../middleware/is-auth');
const demoController = require('../controllers/demoController');

hostRouter.get("/manage-demos", isAuth, demoController.getManageDemos);

hostRouter.post("/manage-demos/add", isAuth, demoController.postAddDemo);

hostRouter.post("/demos/:demoId/delete", isAuth, demoController.postDeleteDemo);

hostRouter.get("/services", isAuth, serviceController.getServices);

hostRouter.get("/services/add", isAuth, serviceController.getAddService);

hostRouter.post("/services/add", isAuth, serviceController.postAddService);

hostRouter.get("/services/edit/:serviceId", isAuth, serviceController.getEditService);

hostRouter.post("/services/edit/:serviceId", isAuth, serviceController.postEditService);

hostRouter.post("/services/delete/:serviceId", isAuth, serviceController.postDeleteService);

hostRouter.get("/enquiries", isAuth, addHomeController.getAllEnquiries);

hostRouter.get("/enquiries/export", isAuth, addHomeController.exportEnquiries);

hostRouter.post("/enquiries/:enquiryId/status", isAuth, addHomeController.updateEnquiryStatus);

hostRouter.get("/revenue", isAuth, addHomeController.getRevenue);

hostRouter.get("/revenue/add", isAuth, addHomeController.getAddClient);

hostRouter.post("/revenue/add", isAuth, addHomeController.postAddClient);

hostRouter.get("/revenue/export", isAuth, addHomeController.exportRevenue);

hostRouter.get("/manage-reviews", isAuth, addHomeController.getManageReviews);

hostRouter.post("/manage-reviews/add", isAuth, addHomeController.postAdminAddReview);

hostRouter.post("/reviews/:reviewId/delete", isAuth, addHomeController.deleteReview);

module.exports = hostRouter;