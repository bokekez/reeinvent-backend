const express = require('express');
const router = express.Router();
const modelSelector = require('../controllers/modelSelectorController');

router.get('/activeModel', modelSelector.getActiveModel);

router.post('/switchModel', modelSelector.selectModel);

module.exports = router;
