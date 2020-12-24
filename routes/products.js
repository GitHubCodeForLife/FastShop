const express = require('express');
let router = express.Router();
let productController = require('../controllers/productsController');
router.use(express.static('public'))
/* GET users listing. */
router.get('/',productController.index);

module.exports = router;
