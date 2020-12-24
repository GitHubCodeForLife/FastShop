var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../config/auth');

/* GET users listing. */
router.get('/',checkAuthenticated, function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/dashboard',checkAuthenticated, function(req, res, next) {
  // console.log('User: ');
  // console.dir(req.user);
  res.render('user/dashboard',{title: 'Dashboard', name: req.user.name});
});

module.exports = router;
