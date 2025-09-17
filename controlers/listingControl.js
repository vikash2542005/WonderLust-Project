const Listing = require('../models/listing.js');

module.exports.index = async (req, res) => {
    const { search } = req.query;
    let filter = {};
    if (search) {
        if (!isNaN(search)) {
            filter.price = { $lte: parseInt(search) };
        } else {
            filter.$or = [
                { location: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } }
            ];
        }
    }
    let allListing = await Listing.find(filter);
    res.render("listings/index", { allListing });
};


module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showPage = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path : "reviews", 
        populate : {
            path : "author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createPage = async(req,res, next)=>{
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.editPage = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing you requested for edit does not exist!");
        return res.redirect("/listings");
    }
    // let originalImageUrl = listing.image.url;
    // originalImageUrl = originalImageUrl.replace("/upload", "/upload/b_brown,c_pad,h_200,w_200");
    res.render("listings/edit.ejs", {listing});
};

module.exports.updatePage = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true});
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename}
        await listing.save();
    }
   
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deletePage = async(req , res) => {
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};