const express = require('express');
const router = express.Router();
const wordsController = require('../controllers/words');

router.get('/', wordsController.getWords);

router.get('/:word', wordsController.getWordByName);

router.post('/', wordsController.addWord);

router.put('/:word', wordsController.updateWord);

router.delete('/:word', wordsController.removeWord);

module.exports = router;
