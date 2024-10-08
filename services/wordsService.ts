import { ActiveModel } from './modelSelectorService';
import modelSelectorService from './modelSelectorService';

interface Word {
  id: number;
  word: string;
  synonym: string[];
  transitive?: string[]; 
}

const getActiveModel = (): ActiveModel => {
  return modelSelectorService.getActiveModel();
};

const getAllWords = (): Word[] => {
  const words = getActiveModel().words as Word[];
  return words;
};

const findWord = (wordSearch: string): Word | undefined => {
  const wordsModel = getActiveModel();
  if (wordsModel.activeModel === 'basic') {
    return wordsModel.words.find((element: Word) =>
      checkWords(element.word, wordSearch)
    );
  }
  const word = wordsModel.words.find((element: Word) =>
    checkWords(element.word, wordSearch)
  );
  const transitive = getTranslativeSynonyms(wordsModel.words as Word[], wordSearch);
  if (!word) return;
  (word as Word & { transitive?: string[] }).transitive = transitive.filter(
    (transSyn) => !word.synonym.includes(transSyn)
  );
  return word;
};

const doSynonymsExist = (synonyms: string[]): string[] => {
  const words = getAllWords();
  return synonyms.filter(
    (synonym) => !words.find((word) => checkWords(word.word, synonym))
  );
};

const insertWord = (word: string, synonyms: string[]): Word => {
  const wordsModel = getActiveModel();
  const newWord: Word = {
    id: (wordsModel.words as Word[]).length + 1,
    word: word,
    synonym: synonyms,
  };

  (wordsModel.words as Word[]).push(newWord);
  addSynonyms(word, synonyms, wordsModel.words as Word[]);
  return newWord;
};

const addSynonyms = (word: string, synonyms: string[], words: Word[]): void => {
  synonyms.forEach((syn) => {
    const updateIndex = words.findIndex((element) =>
      checkWords(element.word, syn)
    );
    if (words[updateIndex].synonym.includes(word)) return;
    words[updateIndex].synonym.push(word);
  });
};

const deleteWord = (word: string): boolean => {
  const words = getAllWords();
  const wordIndex = words.findIndex((element) =>
    checkWords(element.word, word)
  );

  if (wordIndex === -1) {
    return false;
  }

  words.splice(wordIndex, 1);
  words.forEach((element) => {
    element.synonym = element.synonym.filter(
      (synonym) => synonym.toLowerCase() !== word.toLowerCase()
    );
  });
  return true;
};

const editWord = (word: string, newWord: string, newSynonyms: string[]) => {
  const words = getAllWords();
  const wordIndex = words.findIndex((element) =>
    checkWords(element.word, word)
  );

  if (wordIndex === -1) {
    return { success: false, message: `Word '${word}' not found.` };
  }

  const duplicateCheck = findWord(newWord);
  if (duplicateCheck) {
    const synonymCheck = newSynonyms.filter((newSyn) =>
      duplicateCheck.synonym.some((existingSyn) =>
        checkWords(existingSyn, newSyn)
      )
    );
    if (
      duplicateCheck.synonym.length === newSynonyms.length &&
      synonymCheck.length === newSynonyms.length
    ) {
      return {
        success: false,
        message: `Word '${newWord}' already exists with the same synonyms.`,
      };
    }
  }

  const synonymWordCheck = doSynonymsExist(newSynonyms);
  if (synonymWordCheck.length)
    return {
      success: false,
      message: `Synonyms must exist as words, ${synonymWordCheck} are not words!`,
    };

  if (duplicateCheck && words[wordIndex].synonym.length > newSynonyms.length) {
    const wordToUpdate = duplicateCheck.synonym.filter(
      (syn) => !newSynonyms.includes(syn)
    );
    words.forEach((element) => {
      if (wordToUpdate.includes(element.word)) {
        element.synonym = element.synonym.filter(
          (synUpd) => synUpd !== newWord
        );
      }
    });
  }

  if (words[wordIndex].synonym.length < newSynonyms.length) {
    addSynonyms(newWord, newSynonyms, words);
  }

  words[wordIndex].word = newWord;
  words[wordIndex].synonym = newSynonyms;

  words.forEach((element) => {
    if (element.synonym.includes(word)) {
      element.synonym = element.synonym.map((syn) =>
        checkWords(syn, word) ? newWord : syn
      );
    }
  });

  return {
    success: true,
    message: `Word '${word}' updated to '${newWord}'.`,
    word: { word: newWord, synonym: newSynonyms },
  };
};

const getTranslativeSynonyms = (words: Word[], wordSearch: string): string[] => {
  const translative: string[] = [];
  words.forEach((word) => {
    if (word.synonym.some((syn) => checkWords(syn, wordSearch))) {
      const findTranslatives = word.synonym.filter(
        (tran) => tran.toLowerCase() !== wordSearch.toLowerCase()
      );
      if (!findTranslatives.length) return;
      translative.push(...findTranslatives);
    }
  });
  return translative.flat();
};

const findWordBySubstring = (substring: string): Word[] => {
  const words = getAllWords();
  const lowerCaseSubstr = substring.toLowerCase();
  return words.filter((wordObj) =>
    wordObj.word.toLowerCase().includes(lowerCaseSubstr)
  );
};

const checkWords = (word: string, wordSearch: string): boolean => {
  return word.toLowerCase() === wordSearch.toLowerCase();
};

export {
  getAllWords,
  findWord,
  insertWord,
  doSynonymsExist,
  editWord,
  deleteWord,
  findWordBySubstring,
};
