const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Properly import the Review model
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      url: String,
      filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review", // Refers to the Review model
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
});

// Middleware to delete associated reviews after a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
