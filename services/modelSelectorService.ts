import wordsBasic from '../models/wordsBasic';
import wordsTransitive from '../models/wordsTransitive';

type WordsModel = typeof wordsBasic | typeof wordsTransitive;

interface ModelMap {
  [key: string]: WordsModel;
}

export interface ActiveModel {
  activeModel: string;
  words: WordsModel;
}

const modelMap: ModelMap = {
  basic: wordsBasic,
  transitive: wordsTransitive,
};

const activeModel: ActiveModel = {
  activeModel: 'basic',
  words: modelMap['basic'],
};

const getActiveModel = (): ActiveModel => {
  return activeModel;
};

const selectModel = (modelName: string): ActiveModel => {
  const selectedModel = modelMap[modelName];
  if (selectedModel) {
    activeModel.activeModel = modelName;
    activeModel.words = selectedModel;
    return activeModel;
  }
  throw new Error('Invalid model name. Use "basic" or "transitive".');
};

const modelSelectorService = {
  activeModel,
  getActiveModel,
  selectModel,
};

export default modelSelectorService;
