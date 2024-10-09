import express from 'express';
import modelController from '../controllers/modelSelectorController';

const router = express.Router();

router.get('/activeModel', modelController.getActiveModel);

router.post('/switchModel', modelController.selectModel);

export default router;
