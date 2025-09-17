const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

// Define the schema for a listing

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required : true,
    },

    image: {
        // type: String,
        // set: (v)=> v===""? "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        // : v // Set default value if empty string
        url : String,
        filename : String,
    },

    price: {
        type: Number,
        required : true,
    },

    location: {
        type: String,
        required : true,
    },

    country :{
        type: String,
        required : true,
    },

    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        },
    ],

    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
   
    
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in :listing.reviews}});
    }
    
});

// Create the model from the schema
const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;