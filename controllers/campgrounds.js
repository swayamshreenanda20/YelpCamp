const campground= require('../models/campgrounds');


module.exports.index=async(req,res)=>{
   
    const campgrounds=await campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.rendernewform=((req,res)=>{
  
    res.render('campgrounds/new');
})

module.exports.createcampground=async(req,res)=>{
   
    const Campground= new campground (req.body.campground);
    Campground.author=req.user._id;
    
    await Campground.save();
    req.flash('success','successfully made a new campground!');
    res.redirect(`/campgrounds/${Campground._id}`)
}

module.exports.showcampground=async(req,res)=>{

    const{id}=req.params;
    const Campground=await campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }

    }).populate('author')
   
    if(!campground){
        req.flash('error','cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{Campground})
}

module.exports.rendereditform=async(req,res)=>{
    const Campground=await campground.findById(req.params.id)
    if(!Campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
   
    res.render('campgrounds/edit',{Campground})
}

module.exports.updatecampground=async(req,res)=>{
    const{id}=req.params;

    const Campground=await campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${Campground._id}`)
}

module.exports.deletecampground=async(req,res)=>{

    const camp=await campground.findById(id);
       
     const{id}=req.params;
     await campground.findByIdAndDelete(id);
     req.flash('success','Successfully deleted campground');
    
     res.redirect('/campgrounds');
}