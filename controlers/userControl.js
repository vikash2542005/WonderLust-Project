const User = require("../models/user");

module.exports.renderSignupPage = (req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signupPage = async(req,res)=>{
    try{
    let {username , email , password} = req.body;
    const newUser = new User({email, username});

    let registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
           return next(err);
        }
        req.flash("success",`congrats ${username} You register Successfully`);
        res.redirect("/listings");
    });    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginPage = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginPage = async (req, res)=>{
    let {username} = req.body;
    req.flash("success",`Welcome to Wonderlust, you are logged In ${username}`);
    // console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success",`You logged out successfully`);
        res.redirect("/listings");
    })
};