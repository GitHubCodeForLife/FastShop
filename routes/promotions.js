const express = require('express');
const router = express.Router();
const promotionsController = require('../controllers/promotionsControllers');
router.use(express.static('public'));


router.get('/', promotionsController.index);
router.get('/detail',promotionsController.detail);
module.exports = router;
