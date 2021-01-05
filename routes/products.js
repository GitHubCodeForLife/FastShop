const express = require('express');
let router = express.Router();
let productsController = require('../controllers/productsController');
router.use(express.static('public'));
/* GET users listing. */
router.get('/',productsController.index);
//Type router
router.get('/add-to-cart',productsController.addToCart);
router.get('/search', productsController.search);
//Detail Page 
router.get('/detail', productsController.detailPage);
//category
router.get('/:type', productsController.type);


module.exports = router;
