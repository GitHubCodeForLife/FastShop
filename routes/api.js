let express = require('express');
let router = express.Router();
const apiController = require('../controllers/apiControllers');
router.get('/',apiController.index);
router.get('/products', apiController.products);
router.get('/products?page=', apiController.products);
router.get('/auth/verification/verify-account/:userId/:secretCode', apiController.verifyEmail);
module.exports = router;