var express = require('express');
var router = express.Router();
const homeController = require('../controllers/homeController');
const { checkNotAuthenticated, checkAuthenticated} = require('../config/auth');
const orderController = require('../controllers/orderController');
const passport = require('passport');
/* GET home page. */
router.use(express.static('public'));
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
      return res.redirect('/users/dashboard');
    });
  })(req, res, next);
});
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});
router.get('/cart', homeController.cart);
router.get('/increase-by-one', homeController.increaseByOne);
router.get('/decrease-by-one', homeController.decreaseByOne);
router.get('/remove-item', homeController.removeItem);
router.get('/forget-password',checkNotAuthenticated,homeController.getForgetPassword);
router.post('/forget-password',checkNotAuthenticated,homeController.postForgetPassword);
router.get('/password-reset/:total', checkNotAuthenticated, homeController.resetPassword);
router.post('/password-reset/:total', checkNotAuthenticated, homeController.postResetPassword);
router.get('/check-out',checkAuthenticated, homeController.checkout);
router.post('/check-out/place-order', orderController.placeOrder);
module.exports = router;
