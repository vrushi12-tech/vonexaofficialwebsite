const express = require('express');
const path = require('path');
const resgisterHomes = require('./hostRouter').resgisterHomes;
const userRouter = express.Router();
const addHomeController = require('../controllers/addhome');
const hostController = require('../controllers/host');
const demoController = require('../controllers/demoController');


userRouter.get("/", addHomeController.getHome);

userRouter.get("/homes", addHomeController.getRegisteredHomes);

userRouter.get("/bookings", hostController.getBooking);

userRouter.get("/homes/:homesID", hostController.gethomedetails);

// Public enquiry form -- moved here from hostRouter since it must stay
// reachable without logging in, now that hostRouter is fully protected.
userRouter.get("/enquiry", addHomeController.getAddHome);

userRouter.post("/enquiry", addHomeController.postAddHome);

// Public reviews page
userRouter.get("/reviews", addHomeController.getReviews);

userRouter.post("/reviews", addHomeController.postReview);

userRouter.get("/demos", demoController.getDemos);


module.exports = userRouter;