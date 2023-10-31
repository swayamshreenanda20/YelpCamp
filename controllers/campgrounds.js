const campground= require('../models/campgrounds');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});
const { cloudinary} = require("../cloudinary");

module.exports.index=async(req,res)=>{
   
    const campgrounds=await campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.rendernewform=((req,res)=>{
  
    res.render('campgrounds/new');
})

module.exports.createcampground=async(req,res)=>{
    const geoData= await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
   
    const Campground= new campground (req.body.campground);
    Campground.geometry=geoData.body.features[0].geometry;

    Campground.images=req.files.map(f=>({url: f.path, filename: f.filename}));
    Campground.author=req.user._id;
    
    await Campground.save();
    console.log(Campground);
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
    const imgs=req.files.map(f=>({url: f.path, filename: f.filename}));
    Campground.images.push(...imgs);
    await Campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await Campground.updateOne({$pull:{ images: { filename: { $in: req.body.deleteImages}}}})
    }
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