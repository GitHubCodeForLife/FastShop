var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../config/auth');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');
router.use(express.static('public'));

/* GET users listing. */
router.get('/',checkAuthenticated, function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/dashboard',checkAuthenticated,userController.dashboard);

router.get('/edit-profile',checkAuthenticated,userController.getEditProfile);
router.post('/edit-profile', checkAuthenticated, userController.postEditProfile);
router.get('/change-password', checkAuthenticated, userController.getChangePassword);
router.post('/change-password', checkAuthenticated, userController.postChangePassword);

router.get('/orderHistory',checkAuthenticated,orderController.orderHistory);
router.get('/orderHistory/details',checkAuthenticated,orderController.orderDetails);
router.get('/orderHistory/details/cancel',checkAuthenticated,orderController.orderCancel);

module.exports = router;
