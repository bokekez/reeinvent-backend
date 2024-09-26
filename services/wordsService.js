const { getActiveModel } = require('./modelSelectorService');

const getAllWords = () => {
  const words = getActiveModel().words
  return words
}

const findWord = (wordSearch) => {
  const wordsModel = getActiveModel()
  if(wordsModel.activeModel === 'basic') {
    return wordsModel.words.find(element => checkWords(element.word, wordSearch));
  }
  const word = wordsModel.words.find(element => checkWords(element.word, wordSearch))
  const transitive = getTraslativeSynonyms(wordsModel.words, wordSearch)
  word.transitive = transitive || ''
  return word
};

const doSynonymsExist = (synonyms) => {
  const words = getAllWords()
  return synonyms.filter(synonym => 
    !words.find(word => checkWords(word.word, synonym))
  );
};

const insertWord = (word, synonyms) => {
  const words = getAllWords()
  const newWord = {
    id: words.length + 1,  
    word: word,
    synonym: synonyms
  };

  words.push(newWord);
  return newWord;
}

const deleteWord = (word) => {
  const words = getAllWords()
  const wordIndex = words.findIndex(element => checkWords(element.word, word));

  if (wordIndex === -1) {
    return false
  }

  words.splice(wordIndex, 1);
  words.forEach(element => {
    element.synonym = element.synonym.filter(synonym => synonym.toLowerCase() !== word.toLowerCase());
  });
  return true
}

function editWord(word, newWord, newSynonyms) {
  const words = getAllWords()
  const wordIndex = words.findIndex(element => checkWords(element.word, word));

  if (wordIndex === -1) {
    return { success: false, message: `Word '${word}' not found.` };
  }

  const duplicateCheck = findWord(newWord);
  if (duplicateCheck) {
    const synonymCheck = newSynonyms.filter(newSyn => duplicateCheck.synonym.some(existingSyn => checkWords(existingSyn, newSyn)));
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
      element.synonym = element.synonym.map(syn => checkWords(syn, word) ? newWord : syn);
    }
  });

  return { success: true, message: `Word '${word}' updated to '${newWord}'.` };
}

const getTraslativeSynonyms = (words, wordSearch) => {
  const translative = []
  words.forEach(word => {
    if(word.synonym.some(syn => checkWords(syn, wordSearch))){
      const findTranslatives = word.synonym.filter(tran => tran.toLowerCase() !== wordSearch.toLowerCase())
      if(!findTranslatives.length) return
      translative.push(findTranslatives)
  }
  })
  return translative
}

function findWordBySubstring(substring) {
  const words = getAllWords()
  const lowerCaseSubstr = substring.toLowerCase();
  return words.filter(wordObj => wordObj.word.toLowerCase().includes(lowerCaseSubstr));
}

const checkWords = (word, wordSearch) => {
  if(word.toLowerCase() === wordSearch.toLowerCase()) return true
  return false
}

module.exports = {
  getAllWords,
  findWord,
  insertWord,
  doSynonymsExist,
  editWord,
  deleteWord,
  findWordBySubstring
};
