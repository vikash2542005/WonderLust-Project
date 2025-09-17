const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const  {isloggedIn, isOwner, validateListing} = require("../middleware.js");
const listingControl = require("../controlers/listingControl.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});


// for / route
router.route("/")
// index Route
.get(wrapAsync(listingControl.index))
// Create Route
.post(isloggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingControl.createPage));


//New Route
router.get("/new", isloggedIn, listingControl.renderNewForm);


// for /:id route
router.route("/:id")
// show Route
.get(wrapAsync(listingControl.showPage))
// Update route
.put(isloggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingControl.updatePage))
//Delete route
.delete(isloggedIn, isOwner, wrapAsync(listingControl.deletePage));



//edit Route
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(listingControl.editPage));

module.exports = router;