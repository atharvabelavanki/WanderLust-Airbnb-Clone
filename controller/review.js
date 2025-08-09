const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    

    await newReview.save();
    await listing.save();
    
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listingId}`);
};

module.exports.destroyReview=async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted");

    res.redirect(`/listings/${id}`);
}