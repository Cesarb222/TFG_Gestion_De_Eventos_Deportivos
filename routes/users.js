var express = require('express');
var router = express.Router();
const passport = require('passport');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource aa');
});

router.get("/signup",(req,res,next)=>{
  res.render("signup")
})
router.post("/signup",passport.authenticate("local-signup",{
  successRedirect: "/",
  failureRedirect: '/users/signup',
  failureFlash: true //Si hay error si esta esto en truue masnda un mensaje
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

module.exports = router;
