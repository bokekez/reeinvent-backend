const wordsBasic = require('../models/wordsBasic');
const wordsTransitive = require('../models/wordsTransitive');

const activeModel = {
  activeModel: 'basic',
  words: wordsBasic
}

console.log('test', activeModel)

function getActiveModel() {
  return activeModel;
}

function selectModel(modelName) {
  if (modelName === 'basic') {
    activeModel.activeModel = 'basic'
    activeModel.words = wordsBasic
    return activeModel
  } else if (modelName === 'transitive') {
    activeModel.activeModel = 'transitive'
    activeModel.words = wordsTransitive
    return activeModel
  } 
  throw new Error('Invalid model name. Use "basic" or "transitive".');
}

module.exports = {
  activeModel,
  getActiveModel,
  selectModel
};
