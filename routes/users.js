var express = require('express');
var router = express.Router();
const passport = require('passport');


router.get("/signup",(req,res,next)=>{
  res.render("signup")
})

router.post("/signup",passport.authenticate("local-signup",{
  successRedirect: "/",
  failureRedirect: '/users/signup',
  failureFlash: true //Si hay error si esta esto en truue masnda un mensaje
}))


router.get("/signin",(req,res,next)=>{
  res.render("login")
})

router.post("/signin",passport.authenticate("local-signin",{
  successRedirect: "/",
  failureRedirect: '/users/signin',
  failureFlash: true 
}))

router.get("/auth/google", passport.authenticate("google",{
  scope:["profile","email"]
}))

router.get("/google/callback",passport.authenticate("google",{
  successRedirect: "/",
  failureRedirect:"/users/signup"
}))

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  }); 
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
      return next();
  }

  res.redirect('/')
}

module.exports = router;
