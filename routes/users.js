var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../config/auth');

router.use(express.static('public'));

/* GET users listing. */
router.get('/',checkAuthenticated, function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/dashboard',checkAuthenticated, function(req, res, next) {
  // console.log('User: ');
  // console.dir(req.user);
  res.render('user/dashboard',{title: 'Dashboard', user: req.user, name: req.user.name});
});

module.exports = router;
