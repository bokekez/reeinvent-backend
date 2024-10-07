const express = require('express');
const words = require('./wordsRoute');
const modelSelector = require('./modelSelectorRoute');

const router = express.Router();

router.use('/words', words);
router.use('/modelSelector', modelSelector);

module.exports = router;
