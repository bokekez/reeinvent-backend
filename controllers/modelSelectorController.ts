import { Request, Response } from 'express';
import modelSelectorService from '../services/modelSelectorService';

interface RequestWithBody extends Request {
  body: {
    modelName: string;
  };
}

const getActiveModel = (req: Request, res: Response): any => {
  const result = modelSelectorService.getActiveModel();
  return res.status(200).json(result.activeModel);
};

const selectModel = (req: RequestWithBody, res: Response): any => {
  const { modelName } = req.body;

  try {
    modelSelectorService.selectModel(modelName);
    return res
      .status(200)
      .json({ message: `Model switched to '${modelName}'` });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

const modelController = {
  getActiveModel,
  selectModel,
};

export default modelController;
