const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main().then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const initdb = async () => {
    await Listing.deleteMany({}); // Clear existing listings
    initData.data = initData.data.map((obj)=>({
        ...obj,owner : "68bc69b374ae010d30b98fb2"
    }));
    await Listing.insertMany(initData.data); // Insert new listings
    console.log('Database initialized with sample data');
    
}

initdb();

