const { getActiveModel } = require('./modelSelectorService');

const getAllWords = () => {
  const words = getActiveModel().words
  return words
}

const findWord = (wordSearch) => {
  const wordsModel = getActiveModel()
  console.log(wordsModel)
  if(wordsModel.activeModel === 'basic') {
    return wordsModel.words.find(element => element.word.toLowerCase() === wordSearch.toLowerCase());
  }
  const wordAndSynonyms = {
    word: wordsModel.words.find(element => element.word.toLowerCase() === wordSearch.toLowerCase()),
    transitive: getTraslativeSynonyms(wordsModel.words, wordSearch)
  }
  return wordAndSynonyms
};

const doSynonymsExist = (synonyms) => {
  const words = getActiveModel().words
  return synonyms.filter(synonym => 
    !words.find(word => word.word.toLowerCase() === synonym.toLowerCase())
  );
};

const insertWord = (word, synonyms) => {
  const words = getActiveModel().words
  const newWord = {
    id: words.length + 1,  
    word: word,
    synonym: synonyms
  };

  words.push(newWord);
  return newWord;
}

const deleteWord = (word) => {
  const words = getActiveModel().words
  const wordIndex = words.findIndex(element => element.word.toLowerCase() === word.toLowerCase());

  if (wordIndex === -1) {
    return false
  }

  words.splice(wordIndex, 1)[0];
  words.forEach(element => {
    element.synonym = element.synonym.filter(synonym => synonym.toLowerCase() !== word.toLowerCase());
  });
  return true
}

function editWord(word, newWord, newSynonyms) {
  const words = getActiveModel().words
  const wordIndex = words.findIndex(element => element.word.toLowerCase() === word.toLowerCase());

  if (wordIndex === -1) {
    return { success: false, message: `Word '${word}' not found.` };
  }

  const duplicateCheck = words.find(element => element.word.toLowerCase() === newWord.toLowerCase());
  if (duplicateCheck) {
    const synonymCheck = newSynonyms.filter(newSyn => duplicateCheck.synonym.some(existingSyn => existingSyn.toLowerCase() === newSyn.toLowerCase()));
    if(synonymCheck.length === newSynonyms.length) {
      return { success: false, message: `Word '${newWord}' already exists with the same synonyms.` };
    }
  }

  const synonymWordCheck = doSynonymsExist(newSynonyms)

  if(synonymWordCheck.length) return { success: false, message: `Synonyms must exist as words, ${synonymWordCheck} are not words!`};
 
  words[wordIndex].word = newWord;
  words[wordIndex].synonym = newSynonyms;

  words.forEach(element => {
    if (element.synonym.includes(word)) {
      element.synonym = element.synonym.map(syn => syn.toLowerCase() === word.toLowerCase() ? newWord : syn);
    }
  });

  return { success: true, message: `Word '${word}' updated to '${newWord}'.` };
}

const getTraslativeSynonyms = (words, wordSearch) => {
  const translative = []
  words.forEach(word => {
    if(word.synonym.some(syn => syn.toLowerCase() === wordSearch.toLowerCase())){
      translative.push(word.synonym.filter(tran => tran.toLowerCase() !== wordSearch.toLowerCase()))
  }
  })
  return translative
}

module.exports = {
  getAllWords,
  findWord,
  insertWord,
  doSynonymsExist,
  editWord,
  deleteWord
};
