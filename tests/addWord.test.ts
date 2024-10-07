const { doSynonymsExist, insertWord } = require('../services/wordsService');
const { addWord } = require('../controllers/wordsController');

interface Word {
  id: number;
  word: string;
  synonym: string[];
}

describe('addWord', () => {
  type MockResponse = {
    status: jest.Mock;
    json: jest.Mock;
  };

  const mockResponse = (): MockResponse => {
    const res = {} as MockResponse;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res;
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('add a new word', () => {
    const req = { body: { word: 'newWord', synonym: ['Happy'] } };
    const res = mockResponse();

    addWord(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ word: 'newWord' })
    );
  });

  test('add a new word that already exists', () => {
    const req = { body: { word: 'Happy', synonym: ['Joyful'] } };
    const res = mockResponse();

    addWord(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Word 'Happy' already exists" })
    );
  });

  test('add a new word but no word passed', () => {
    const req = { body: { word: '', synonym: ['Joyful'] } };
    const res = mockResponse();

    addWord(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid input: word is required.' })
    );
  });

  test('add a new word but synonym doesn not exist', () => {
    const req = { body: { word: 'newWord', synonym: ['test'] } };
    const res = mockResponse();

    addWord(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Word 'newWord' already exists" })
    );
  });

  test('check if synonyms exist as words', () => {
    const synoymCheck = doSynonymsExist(['Happy', 'Joyful']);

    expect(synoymCheck).toHaveLength(0);
  });

  test('check if synonyms do not exist as words', () => {
    const synoymCheck = doSynonymsExist(['Happy', 'test']);

    expect(synoymCheck).toHaveLength(1);
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
