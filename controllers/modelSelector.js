const modelSelectorService = require('../services/modelSelectorService');

function getActiveModel(req, res) {
  const result = modelSelectorService.getActiveModel();
  res.status(200).json(result.activeModel);
}

function selectModel(req, res) {
  const { modelName } = req.body;

  try {
    modelSelectorService.selectModel(modelName);
    res.status(200).json({ message: `Model switched to '${modelName}'` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getActiveModel,
  selectModel,
};
