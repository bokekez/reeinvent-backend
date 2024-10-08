import modelController from '../services/modelSelectorService';
import { findWord } from '../services/wordsService';
import wordsController from '../controllers/wordsController';

interface Word {
  id: number;
  word: string;
  synonym: string[];
  transitive?: string[];
}

type MockRequest = Partial<Request> & { params: { [key: string]: string } };

type MockResponse = {
  status: jest.Mock;
  json: jest.Mock;
};

const mockRequest = (params: { [key: string]: string }): MockRequest => ({
  params,
});

const mockResponse = (): MockResponse => {
  const res = {} as MockResponse;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('findWord', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('should return word details if the word is found', () => {
    const req = mockRequest({ word: 'happy' });
    const res = mockResponse();

    wordsController.getWordByName(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Success',
        data: {
          id: expect.any(Number),
          word: 'Happy',
          synonym: ['Joyful', 'Cheerful'],
        },
      })
    );
  });

  test('should return 404 if the word is not found', () => {
    const req = mockRequest({ word: 'Sad' });
    const res = mockResponse();

    wordsController.getWordByName(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Word 'Sad' not found. not found.",
    });
  });

  test('should find a word in the basic model', () => {
    const model = modelController.getActiveModel();

    if (model.activeModel !== 'basic') modelController.selectModel('basic');

    const result: Word | undefined = findWord('Happy');

    expect(model.activeModel).toEqual('basic');
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        word: 'Happy',
        synonym: ['Joyful', 'Cheerful'],
      })
    );
  });

  test('should return undefined when no word is found in the basic model', () => {
    const result: Word | undefined = findWord('Sad');

    expect(result).toBeUndefined();
  });

  test('should find a word and add transitive synonyms in the non-basic model', () => {
    const model = modelController.getActiveModel();

    if (model.activeModel === 'basic')
      modelController.selectModel('transitive');

    const getCurrentModel = modelController.getActiveModel();
    expect(getCurrentModel.activeModel).toEqual('transitive');

    const result: Word | undefined = findWord('Happy');

    modelController.selectModel('basic');

    const getExitModel = modelController.getActiveModel();
    expect(getExitModel.activeModel).toEqual('basic');
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        word: 'Happy',
        synonym: ['Joyful'],
        transitive: ['Cheerful'],
      })
    );
  });

  test('should return undefined if no matching word and no transitive synonyms', () => {
    const result: Word | undefined = findWord('Sad');

    expect(result).toBeUndefined();
  });
});
