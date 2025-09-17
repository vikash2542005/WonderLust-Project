const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js');
const {validateReview , isloggedIn} = require("../middleware.js");
const reviewControl = require("../controlers/reviewControl.js");

//Review
// Post Review Route
router.post("/", validateReview, isloggedIn, wrapAsync(reviewControl.createReviewPage));

// DELETE Review Route
router.delete("/:reviewId", wrapAsync(reviewControl.deleteReview));

module.exports = router;