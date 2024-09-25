const wordsBasic = require('../models/wordsBasic');
const wordsTransitive = require('../models/wordsTransitive');

const modelMap = {
  basic: wordsBasic,
  transitive: wordsTransitive
};

const activeModel = {
  activeModel: 'basic',
  words: modelMap['basic']
};

function getActiveModel() {
  return activeModel;
}

function selectModel(modelName) {
  const selectedModel = modelMap[modelName];
  if (selectedModel) {
    activeModel.activeModel = modelName;
    activeModel.words = selectedModel;
    return activeModel;
  }
  throw new Error('Invalid model name. Use "basic" or "transitive".');
}

module.exports = {
  activeModel,
  getActiveModel,
  selectModel
};
