var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../config/auth');
const userController = require('../controllers/userController');
router.use(express.static('public'));

/* GET users listing. */
router.get('/',checkAuthenticated, function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/dashboard',checkAuthenticated,userController.dashboard);

router.get('/editProfile',checkAuthenticated,userController.getEditProfile);
router.post('/editProfile', checkAuthenticated, userController.postEditProfile);
router.get('/changePassword', checkAuthenticated, userController.getChangePassword);


module.exports = router;
