const expresserror= require('./utils/expresserror')
const {campgroundssschema}= require('./schemas.js');
const campground= require('./models/campgrounds');
const review=require('./models/review');
const {reviewsschema}=require('./schemas.js');


module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()) {
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must be signed in first');
        return res.redirect('/login');
    }

    next();

}


module.exports.validatecampground=(req,res,next)=>{
    
    const {error}=campgroundssschema.validate(req.body);
    if(error){
      const msg=error.details.map(el=>el.message).join('.')
      throw new expresserror(msg,400)
    } else{
      next();
    }
    
}




module.exports. isAuthor= async(req,res,next)=>{
    const{id}=req.params;
    const camp=await campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports. validatereview=(req,res,next)=>{
    
    const {error}=reviewsschema.validate(req.body);
    if(error){
      const msg=error.details.map(el=>el.message).join('.')
      throw new expresserror(msg,400)
    } else{
      next();
    }
    
}


module.exports. isAuthorreview= async(req,res,next)=>{
    const{id,reviewId}=req.params;
    const rev=await review.findById(reviewId);
    if(!rev.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

