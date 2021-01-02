const express = require('express');
let router = express.Router();
let productsController = require('../controllers/productsController');
router.use(express.static('public'));
/* GET users listing. */
router.get('/',productsController.index);
//Type router
router.get('/add-to-cart',productsController.addToCart);
router.get('/search', productsController.search);
//category
//routet.get('/:category', productsController.category);
 

module.exports = router;
