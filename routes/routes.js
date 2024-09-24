const express = require('express');
const words = require('./words');
const modelSelector = require('./modelSelector');

const router = express.Router();

router.use('/words', words);
router.use('/modelSelector', modelSelector);

module.exports = router;
