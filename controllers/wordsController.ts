import { Request, Response } from 'express';
import {
  getAllWords,
  findWord,
  insertWord,
  doSynonymsExist,
  editWord,
  deleteWord,
  findWordBySubstring,
} from '../services/wordsService';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  invalidInputResponse,
  customResponse,
} from '../middleware/responseHelper'
// const {
//   getAllWords,
//   findWord,
//   insertWord,
//   doSynonymsExist,
//   editWord,
//   deleteWord,
//   findWordBySubstring,
// } = require('../services/wordsService');
// const {
//   successResponse,
//   errorResponse,
//   notFoundResponse,
//   invalidInputResponse,
//   customResponse,
//   statusMap
// } = require('../middleware/responseHelper');

interface RequestWithQuery extends Request {
  query: {
    search?: string;
  };
}

interface RequestWithParams extends Request {
  params: {
    word: string;
  };
}

interface WordRequestBody {
  word: string;
  synonym: Array<string>;
}

interface RequestWithBody extends Request {
  body: WordRequestBody;
}

interface RequestWithBodyAndParams extends Request {
  params: {
    word: string;
  };
  body: {
    newWord?: string;
    newSynonyms?: Array<string>;
  };
}

const getWords = (req: RequestWithQuery, res: Response): any => {
  const { search } = req.query;
  
  if (!search) {
    return res.status(200).json(successResponse(getAllWords()));
  }

  if (search.length < 2) {
    return res.status(404).json(errorResponse('Search word is too short.'));
  }

  const filteredWords = findWordBySubstring(search);
  if (filteredWords.length) {
    return res.status(200).json(successResponse(filteredWords));
  }

  return res
    .status(404)
    .json(notFoundResponse(`No words found containing '${search}'.`));
};

const getWordByName = (req: RequestWithParams, res: Response): any => {
  const word = req.params.word.toLowerCase();
  const foundWord = findWord(word);

  if (foundWord) {
    return res.status(200).json(successResponse(foundWord));
  }

  return res.status(404).json(notFoundResponse(`Word '${req.params.word}' not found.`));
};

const addWord = (req: RequestWithBody, res: Response): any => {
  const { word, synonym } = req.body;

  if (!word) {
    return res
      .status(400)
      .json(invalidInputResponse('word is required.'));
  }

  if (findWord(word)) {
    return res
      .status(400)
      .json(errorResponse(`Word '${word}' already exists.`));
  }

  const nonExistingSynonyms = doSynonymsExist(synonym);
  if (synonym.length && nonExistingSynonyms.length) {
    return res.status(400).json(
      errorResponse(
        `Synonym(s) ${nonExistingSynonyms} do not exist in the words array.`
      )
    );
  }

  const newWord = insertWord(word, synonym);
  return res.status(201).json(successResponse(newWord));
};

const updateWord = (req: RequestWithBodyAndParams, res: Response): any => {
  const { word } = req.params;
  const { newWord, newSynonyms } = req.body;

  if (!word || !newWord || !newSynonyms || !Array.isArray(newSynonyms)) {
    return res.status(400).json(
      invalidInputResponse('newWord and newSynonyms are required.')
    );
  }

  const result = editWord(word, newWord, newSynonyms);

  if (!result.success) {
    return res.status(400).json(errorResponse(result.message));
  }

  return res
    .status(200)
    .json(
      customResponse(
        `${word} updated to ${newWord}`,
        { newWord, newSynonyms }
      )
    );
};

const removeWord = (req: RequestWithParams, res: Response): any => {
  const { word } = req.params;
  const wordDeleted = deleteWord(word);

  if (!wordDeleted) {
    return res.status(404).json(notFoundResponse(`Word '${word}' not found.`));
  }

  return res
    .status(200)
    .json(customResponse(`Word '${word}' deleted successfully.`));
};

const wordsController = {
  getWords,
  getWordByName,
  addWord,
  updateWord,
  removeWord,
};

export default wordsController