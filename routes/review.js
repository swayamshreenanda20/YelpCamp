const express= require('express');
const router= express.Router({mergeParams:true});
const catchasync=require('../utils/catchasync');
const reviews=require('../controllers/reviews');
const expresserror=require('../utils/expresserror');
const methodoverride=require('method-override');
const {validatereview,isloggedin,isAuthorreview}=require('../middleware');

router.use(express.urlencoded({extended:true}));
router.use(methodoverride("_method"));



router.post('/',isloggedin,validatereview,catchasync(reviews.createreview));
     
router.delete('/:reviewId',isloggedin,isAuthorreview,catchasync(reviews.deletereview));


module.exports=router;