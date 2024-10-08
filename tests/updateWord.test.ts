import { editWord } from '../services/wordsService';
import wordsController from '../controllers/wordsController';

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

  test('add a new word but word already exists with the same synonyms', () => {
    const mockRequest = {
      params: { word: 'Happy' },
      body: {
        newWord: 'Happy',
        newSynonyms: ['Joyful', 'Cheerful'],
      },
    };
    const req = mockRequest;
    const res = mockResponse();

    wordsController.updateWord(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Word 'Happy' already exists with the same synonyms.",
      })
    );
  });

  test('add a new word', () => {
    const mockRequest = {
      params: { word: 'Happy' },
      body: {
        newWord: 'newWord',
        newSynonyms: ['Joyful'],
      },
    };
    const req = mockRequest;
    const res = mockResponse();

    wordsController.updateWord(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Happy updated to newWord',
        data: {
          // id: expect.any(Number),
          newWord: 'newWord',
          newSynonyms: ['Joyful'],
        },
      })
    );

    const responseData = res.json.mock.calls[0][0];
    const wordExists = responseData.data.newSynonyms.some(
      (word: string) => word === 'Joyful'
    );

    expect(wordExists).toBe(true);
  });

  test('add a new word no params', () => {
    const mockRequest = {
      params: '',
      body: {
        newWord: 'newWord',
        newSynonyms: ['Joyful'],
      },
    };
    const req = mockRequest;
    const res = mockResponse();

    wordsController.updateWord(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid input: newWord and newSynonyms are required..',
      })
    );
  });

  test('add a new word no new word', () => {
    const mockRequest = {
      params: { word: 'Happy' },
      body: {
        newWord: '',
        newSynonyms: ['Joyful'],
      },
    };
    const req = mockRequest;
    const res = mockResponse();

    wordsController.updateWord(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid input: newWord and newSynonyms are required..',
      })
    );
  });

  test('add a new word no new synonyms', () => {
    const mockRequest = {
      params: { word: 'Happy' },
      body: {
        newWord: 'newWord',
        newSynonyms: '',
      },
    };
    const req = mockRequest;
    const res = mockResponse();

    wordsController.updateWord(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid input: newWord and newSynonyms are required..',
      })
    );
  });

  test('add a new word but word does not exist', () => {
    const mockRequest = {
      params: { word: 'Happy' },
      body: {
        newWord: 'newWordTest',
        newSynonyms: ['Joyful'],
      },
    };
    const req = mockRequest;
    const res = mockResponse();

    wordsController.updateWord(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Word 'Happy' not found." })
    );
  });

  test('add a new word but the new synonyms are not words', () => {
    const mockRequest = {
      params: { word: 'newWord' },
      body: {
        newWord: 'Happy',
        newSynonyms: ['Joyful', 'test', 'test2'],
      },
    };
    const req = mockRequest;
    const res = mockResponse();

    wordsController.updateWord(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Synonyms must exist as words, test,test2 are not words!',
      })
    );
  });
});
