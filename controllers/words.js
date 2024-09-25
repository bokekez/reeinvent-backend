const { getAllWords, findWord, insertWord, doSynonymsExist, editWord, deleteWord, findWordBySubstring } = require('../services/wordsService');

const getWords = (req, res) => {
  const { search } = req.query; 

  if(!search) return res.json(getAllWords());

  if(search.length < 2) return res.status(404).json({ message: `Search word is too short.` });

  const filteredWords = findWordBySubstring(search);
  if (filteredWords.length) {
      return res.json(filteredWords);
  } 
  return res.status(404).json({ message: `No words found containing '${search}'.` });
};

const getWordByName = (req, res) => {
  const word = req.params.word.toLowerCase(); 
  const foundWord = findWord(word);

  if (foundWord) {
    return res.json(foundWord);
  } 

  res.status(404).json({ message: `Word '${req.params.word}' not found` });
};

const addWord = (req, res) => {
  const { word, synonym } = req.body;

  if (!word) {
    return res.status(400).json({ message: 'Invalid input: word is required.' });
  }

  if (findWord(word)) {
    return res.status(400).json({ message: `Word '${word}' already exists` });
  }

  const nonExistingSynonyms = doSynonymsExist(synonym);
  if (synonym.length && nonExistingSynonyms.length) {
    return res.status(400).json({ message: `Synonym(s) ${nonExistingSynonyms} do not exist in the words array.`});
  }

  const newWord = insertWord(word, synonym);
  res.status(201).json(newWord);
};

const updateWord = (req, res) => {
  const { word } = req.params;
  const { newWord, newSynonyms } = req.body;

  if (!word || !newWord || !newSynonyms || !Array.isArray(newSynonyms)) {
    return res.status(400).json({ message: 'Invalid input: newWord and newSynonyms are required.' });
  }

  const result = editWord(word, newWord, newSynonyms);

  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }

  res.status(200).json({ message: `${word} updated to ${newWord}`, newWord, newSynonyms });
};

const removeWord = (req, res) => {
  const { word } = req.params;
  const wordDeleted = deleteWord(word);

  if (!wordDeleted) {
    return res.status(404).json({ message: `Word '${word}' not found.` });
  }

  res.status(200).json({ message: `Word '${word}' deleted successfully.` });
};

module.exports = {
  getWords,
  getWordByName,
  addWord,
  updateWord,
  removeWord
};
