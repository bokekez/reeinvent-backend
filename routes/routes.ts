import express from 'express';
import words from './wordsRoute';
import modelSelector from './modelSelectorRoute';

const router = express.Router();

router.use('/words', words);
router.use('/modelSelector', modelSelector);

export default router;
