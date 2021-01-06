const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionControllers');
router.use(express.static('public'));


router.get('/', promotionController.index);

module.exports = router;
