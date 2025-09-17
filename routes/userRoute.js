const express = require("express");
// const { route } = require("./listingRouts");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const {saveRedirectUrl} = require("../middleware.js");
const userControler = require("../controlers/userControl.js");

// signup functionlity
// RenderSignUpPage
router.get("/signup", userControler.renderSignupPage);

//signUp
router.post("/signup", wrapAsync(userControler.signupPage));

//login functionlity
// RenderLoginPage
router.get("/login", userControler.renderLoginPage);

// login page
router.post("/login", saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash : true}) ,userControler.loginPage);

//logOut
router.get("/logout",userControler.logOut);



module.exports = router;