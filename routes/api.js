let express = require('express');
let router = express.Router();
const apiController = require('../controllers/apiControllers');
router.use(express.static('public'));

router.get('/',apiController.index);

router.get('/products', apiController.products);
router.get('/products?page=', apiController.products);
router.get('/auth/verification/verify-account/:userId/:secretCode', apiController.verifyEmail);
router.get('/products/search', apiController.searchProducts);
router.get('/products/comments/:product_id', apiController.getComment);
router.post('/products/comments/:product_id', apiController.postComment);


router.get('/users/findOne', apiController.findUser);
module.exports = router;