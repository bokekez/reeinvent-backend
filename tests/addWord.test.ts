import { doSynonymsExist, insertWord } from '../services/wordsService';
import wordsController from '../controllers/wordsController';
import { Request, Response } from 'express';

interface WordRequestBody {
  word: string;
  synonym: string[];
}

interface MockRequest extends Partial<Request> {
  body: WordRequestBody;
}

interface MockResponse extends Partial<Response> {
  status: jest.Mock;
  json: jest.Mock;
}

describe('addWord', () => {
  const mockResponse = (): MockResponse => {
    const res = {} as MockResponse;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res;
  };

  const mockRequest = (body: WordRequestBody): MockRequest => {
    return {
      body,
    } as MockRequest;
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('add a new word', () => {
    const req = mockRequest({ word: 'newWord', synonym: ['Happy'] });
    const res = mockResponse();

    wordsController.addWord(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Success',
        data: {
          id: expect.any(Number),
          word: 'newWord',
          synonym: ['Happy'],
        },
      })
    );
  });

  test('add a new word that already exists', () => {
    const req = mockRequest({ word: 'Happy', synonym: ['Joyful'] });
    const res = mockResponse();

    wordsController.addWord(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Word 'Happy' already exists." })
    );
  });

  test('add a new word but no word passed', () => {
    const req = mockRequest({ word: '', synonym: ['Joyful'] });
    const res = mockResponse();

    wordsController.addWord(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid input: word is required..' })
    );
  });

  test('add a new word but synonym doesn not exist', () => {
    const req = mockRequest({ word: 'newWord', synonym: ['test'] });
    const res = mockResponse();

    wordsController.addWord(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Word 'newWord' already exists." })
    );
  });

  test('check if synonyms exist as words', () => {
    const synonymCheck = doSynonymsExist(['Happy', 'Joyful']);
    expect(synonymCheck).toHaveLength(0);
  });

  test('check if synonyms do not exist as words', () => {
    const synonymCheck = doSynonymsExist(['Happy', 'test']);
    expect(synonymCheck).toHaveLength(1);
  });

  test('check if word was added to word list', () => {
    const mockArgs = { word: 'newWord', synonyms: ['Happy'] };
    const result = insertWord(mockArgs.word, mockArgs.synonyms);

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        word: 'newWord',
        synonym: ['Happy'],
      })
    );
  });
});
