const review=require('../models/review');
const campground=require('../models/campgrounds');

module.exports.createreview=async(req,res)=>{
    
    const Campground=await campground.findById(req.params.id);
    const Review= new review(req.body.review);
    Review.author=req.user._id;
    Campground.reviews.push(Review);
    await Review.save();
    await Campground.save();
    req.flash('success','Created new review!');
    res.redirect(`/campgrounds/${Campground._id}`);
}

module.exports.deletereview=async(req,res)=>{
    const{id,reviewId}=req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}