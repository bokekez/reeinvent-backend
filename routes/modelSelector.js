const express = require('express');
const router = express.Router();
const modelSelector = require('../controllers/modelSelector');

router.get('/activeModel', modelSelector.getActiveModel);

router.post('/switchModel', modelSelector.selectModel);

module.exports = router;
