const user= require('../models/user');

module.exports.renderregister=(req,res)=>{
    res.render('users/register')
}


module.exports.register= async(req,res)=>{
        try{
        const{email,username,password}=req.body;
        const User= new user({email,username});
        const registereduser= await user.register(User,password);
        //await User.save();
        req.login(registereduser,err=>{
        if(err)return next(err);
        req.flash('success','Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
      })
       
    
        }catch(e)
        {
            req.flash('error',e.message);
            res.redirect('register');
        }
    

}

module.exports.renderlogin=(req,res)=>{
    res.render('users/login')
    
}

module.exports.login=(req,res)=>{
    req.flash('success','Welcome back!');
   const redirecturl= req.session.returnTo ||'/campgrounds';
   
    res.redirect(redirecturl);
    delete req.session.returnto;
 }


module.exports.logout=(req,res)=>{
    req.logout(function(err){
    if (err) { return next(err); }
    req.flash('success','successfully logged out'); 
    res.redirect('/campgrounds');
 })
}
