const express= require('express');
const user= require('../models/user');
const router= express.Router();
const methodoverride=require('method-override');
const flash= require('connect-flash');
const catchasync=require('../utils/catchasync');
const passport=require('passport');
router.use(express.urlencoded({extended:true}));
router.use(methodoverride("_method"));
const users=require('../controllers/users');




 router.get('/register',users.renderregister);
 

 router.post('/register',catchasync(users.register));
 

 router.get('/login',users.renderlogin);
 

 router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),users.login);
 
 router.get('/logout',users.logout)


module.exports=router;