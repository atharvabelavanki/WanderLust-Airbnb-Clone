const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    console.log("Populated Reviews:", listing.reviews); // Check the content of reviews
    res.render("listings/show.ejs", { listing });
};

// module.exports.createListing=async(req,res,next)=>{
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"Send valid data for listing");
//     // }
//     const newListing=new Listing(req.body.listing);
//     newListing.owner=req.user._id;
//     await newListing.save();
//     req.flash("success","New Listing Created");
//     res.redirect("/listings");
    
// };

module.exports.createListing=async(req,res,next)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
    
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.UpdateListing = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

        // Update image if a new file is uploaded
        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            updatedListing.image = { url, filename };
            await updatedListing.save();
        }

        console.log("Redirecting to /listings...");
        req.flash("success", "Listing Updated");
        res.redirect("/listings"); // Redirect after successful update
    } catch (err) {
        console.error("Error while updating listing:", err);
        req.flash("error", "Failed to update listing.");
        res.redirect(`/listings/${req.params.id}/edit`); // Redirect back to edit form on error
    }
};



module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");

};