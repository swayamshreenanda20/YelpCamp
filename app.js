

if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}




const express=require('express');
const app=express();
const path=require('path')
const mongoose=require('mongoose');
const ejsmate=require('ejs-mate');
const joi=require('joi');
const catchasync=require('./utils/catchasync');
const {campgroundsschema,reviewschema}=require('./schemas.js');
const session= require('express-session');
const expresserror=require('./utils/expresserror');
const flash= require('connect-flash');
const methodoverride=require('method-override');
const campground=require('./models/campgrounds');
const review=require('./models/review');
const user=require('./models/user');
const campgroundsroutes = require('./routes/campgrounds');
const reviewsroutes = require('./routes/review');
const usersroutes = require('./routes/user');
const passport=require('passport');
const localstrategy= require('passport-local');


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')


.then(data =>{
    console.log("it worked")
    console.log(data);
})
.catch(e=>{
 console.log('UH OHH ERROR')
 console.log(e)
})
}
app.engine('ejs',ejsmate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname,'public')));


const sessionconfig={
  secret:'thisshouldbebettersecret',
  resave: false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now()+1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
  }
}

app.use(session(sessionconfig)) //this should be written before passport.session()
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.use((req,res,next)=>{
  
  res.locals.currentuser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');

  next();
})

app.use('/campgrounds',campgroundsroutes)
app.use('/campgrounds/:id/reviews',reviewsroutes)
app.use('/',usersroutes)



app.get('/',(req,res)=>{
    res.render('home')
})


app.use(express.urlencoded({extended:true}))

app.all('*',(req,res,next)=>{

    next(new expresserror('page not found',404))
   
})

app.use((err,req,res,next)=>{
    const{ statuscode=500}=err;
   
    console.log(err)
    if(!err.message) err.message='Oh No, Something Went Wrong!'

   res.status(statuscode).render('error',{err}) ;
})

app.listen(3000,()=>{
    console.log("listening on port 3000!!")
})