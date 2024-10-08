import express from 'express';
import wordsController from '../controllers/wordsController';

const router = express.Router();

router.get('/', wordsController.getWords);

router.get('/:word', wordsController.getWordByName);

router.post('/', wordsController.addWord);

router.put('/:word', wordsController.updateWord);

router.delete('/:word', wordsController.removeWord);

export default router;
