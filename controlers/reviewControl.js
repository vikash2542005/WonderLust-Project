const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');

module.exports.createReviewPage = async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("new review save");
    req.flash("success", "Review Created");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});

    await Review.findByIdAndDelete(reviewId);

    console.log("review deleted successfully");
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
};