if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
};
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const Listing = require('./models/listing');
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
//Requiring Routes
const listingsRoute = require("./routes/listingRouts.js");
const reviewsRoute = require('./routes/reviewsRoute.js');
const userRoute = require('./routes/userRoute.js');

// Added for Cloudinary multer storage
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const MongoStore = require("connect-mongo");
const cloudinary = require('cloudinary');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'your-folder-name',
    allowed_formats: ['jpeg', 'png', 'jpg']
  }
});

// Multer parser instance for file uploads
const parser = multer({ storage: storage });


const port = 8080;
// const mongoUrl = 'mongodb://127.0.0.1:27017/wonderlust';
const dbUrl = process.env.ATLESDB_URL;
// Connect to MongoDB
main().then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"/public")));

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//for ejs-mate
app.engine('ejs', ejsMate);

const Store =MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRATE,
    },
    touchAfter : 24*3600,
});

Store.on("error", (err)=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store: Store,
    secret : process.env.SECRATE,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
};

//Root Route
app.get('/', (req, res) => {
    res.redirect("/signup");
});

//Using Session & flash
app.use(session(sessionOptions));
app.use(flash());

//implement passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleWare
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// take a demo 
// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email : "demo@gmail.com",
//         username : "demo Name",
//     });

//     let addUser = await User.register(fakeUser, "demopassword");
//     res.send(addUser);
// })


// Listings Router
app.use("/listings", listingsRoute);
//Review Router
app.use("/listings/:id/reviews", reviewsRoute);
// User Router
app.use("/", userRoute);

// now express is updated so only Astrisk (*) is considerd as a operator thats why we have to use it with /.*/ for all  
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"))
});

app.use((err, req, res, next) =>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("listings/error", { err });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
