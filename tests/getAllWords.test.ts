const {
  getAllWords,
  findWordBySubstring,
} = require('../services/wordsService');
const { getWords } = require('../controllers/wordsController');

interface Word {
  id: number;
  word: string;
  synonym: string[];
}

describe('getWords', () => {
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

  test('should return all words', () => {
    const req = { query: { search: '' } };
    const res = mockResponse();

    getWords(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    const responseData = res.json.mock.calls[0][0];
    const wordExists = responseData.some(
      (wordObj: { word: string }) => wordObj.word === 'Happy'
    );

    expect(wordExists).toBe(true);
  });

  test('should return all words with strgin', () => {
    const req = { query: { search: 'Happy' } };
    const res = mockResponse();

    getWords(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    const responseData = res.json.mock.calls[0][0];
    const wordExists = responseData.some(
      (wordObj: { word: string }) => wordObj.word === 'Happy'
    );

    expect(wordExists).toBe(true);
  });

  test('should return all words with substring', () => {
    const req = { query: { search: 'ppy' } };
    const res = mockResponse();

    getWords(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    const responseData = res.json.mock.calls[0][0];
    const wordExists = responseData.some(
      (wordObj: { word: string }) => wordObj.word === 'Happy'
    );

    expect(wordExists).toBe(true);
  });

  test('should return 404 if the word is not found', () => {
    const req = { query: { search: 'Sad' } };
    const res = mockResponse();

    getWords(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No words found containing 'Sad'.",
    });
  });

  test('get all words service returns all words', () => {
    const allWords = getAllWords();
    const wordExists = allWords.some(
      (wordObj: { word: string }) => wordObj.word === 'Happy'
    );

    expect(wordExists).toBe(true);
  });

  test('find words by substring', () => {
    const foundWords = findWordBySubstring('Happy');
    const wordExists = foundWords.some(
      (wordObj: { word: string }) => wordObj.word === 'Happy'
    );

    const foundWordsSub = findWordBySubstring('ppy');
    const wordExistsSub = foundWordsSub.some(
      (wordObj: { word: string }) => wordObj.word === 'Happy'
    );

    expect(wordExists).toBe(true);
    expect(wordExistsSub).toBe(true);
  });
});
