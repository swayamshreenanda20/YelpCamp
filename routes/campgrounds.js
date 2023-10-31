const express= require('express');
const router= express.Router();
const campgrounds=require('../controllers/campgrounds');
const catchasync=require('../utils/catchasync');
const methodoverride=require('method-override');
const {isloggedin}=require('../middleware');
const {isAuthor}=require('../middleware');
const {validatecampground}=require('../middleware');
const multer=require('multer');
const{storage}=require('../cloudinary');
const upload= multer({storage});


router.use(express.urlencoded({extended:true}));
router.use(methodoverride("_method"));


router.get('/',catchasync(campgrounds.index));


router.post('/',isloggedin,upload.array('image'),validatecampground,catchasync(campgrounds.createcampground))
//router.post('/',upload.array('image'),(req,res)=>{
    //console.log(req.body, req.files);
    //res.send("it worked");
//})

router.get('/new',isloggedin,campgrounds.rendernewform)


router.get('/:id',catchasync(campgrounds.showcampground))

router.get('/:id/edit',isloggedin,isAuthor,catchasync(campgrounds.rendereditform))

router.put('/:id',isloggedin,isAuthor,upload.array('image'),validatecampground,catchasync(campgrounds.updatecampground))

router.delete('/:id',isAuthor, catchasync(campgrounds.deletecampground))


module.exports=router;