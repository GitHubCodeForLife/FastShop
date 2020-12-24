var express = require('express');
var router = express.Router();
const homeController = require('../controllers/homeController');
const { checkNotAuthenticated} = require('../config/auth');
const passport = require('passport');
/* GET home page. */
router.get('/',homeController.index);
router.get('/login',checkNotAuthenticated, homeController.login);
router.get('/signup',checkNotAuthenticated, homeController.signup);
router.post('/signup',checkNotAuthenticated,homeController.postSignup);
router.post('/login',checkNotAuthenticated,function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      console.log(info['message']);  
      return res.render('user/login',{title: 'Login Page', message: info['message']});
     }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/dashboard?name=' + user.name);
    });
  })(req, res, next);
});
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;
