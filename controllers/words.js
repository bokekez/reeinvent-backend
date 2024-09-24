const { getAllWords, findWord, insertWord, doSynonymsExist, editWord, deleteWord } = require('../services/wordsService');

exports.getAllWords = (req, res) => {
  res.json(getAllWords());
};

exports.getWordByName = (req, res) => {
  const word = req.params.word.toLowerCase(); 
  const foundWord = findWord(word);

  if (foundWord) {
    return res.json(foundWord);
  } 

  res.status(404).json({ message: `Word '${req.params.word}' not found` });
};

exports.addWord = (req, res) => {
  const { word, synonym } = req.body;

  if (!word || !synonym || !Array.isArray(synonym)) {
    return res.status(400).json({ message: 'Invalid input: word and synonyms are required.' });
  }

  if (findWord(word)) {
    return res.status(400).json({ message: `Word '${word}' already exists` });
  }

  const nonExistingSynonyms = doSynonymsExist(synonym);
  if (nonExistingSynonyms.length) {
    return res.status(400).json(`Synonym(s) ${nonExistingSynonyms} do not exist in the words array.`);
  }

  const newWord = insertWord(word, synonym);
  res.status(201).json(newWord);
};

exports.updateWord = (req, res) => {
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

exports.deleteWord = (req, res) => {
  const { word } = req.params;
  const wordDeleted = deleteWord(word);

  if (!wordDeleted) {
    return res.status(404).json({ message: `Word '${word}' not found.` });
  }

  res.status(200).json({ message: `Word '${word}' deleted successfully.` });
};
