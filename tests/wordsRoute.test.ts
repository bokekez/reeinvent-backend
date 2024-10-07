const request = require('supertest');
const express = require('express');
const wordsRouter = require('../routes/wordsRoute');
const wordsController = require('../controllers/wordsController');

const app = express();
app.use(express.json());
app.use('/words', wordsRouter);

jest.mock('../controllers/wordsController');

describe('Words API', () => {
  describe('GET /words', () => {
    it('should return a list of words with status 200', async () => {
      const mockWords = [
        { word: 'apple', synonyms: ['fruit', 'food'] },
        { word: 'banana', synonyms: ['fruit', 'yellow'] },
      ];
      wordsController.getWords.mockImplementation((req: any, res: any) => {
        res.status(200).json(mockWords);
      });

      const response = await request(app).get('/words');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockWords);
    });

    it('should return an empty array if there are no words', async () => {
      wordsController.getWords.mockImplementation((req: any, res: any) => {
        res.status(200).json([]);
      });

      const response = await request(app).get('/words');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 500 if there is a server error', async () => {
      wordsController.getWords.mockImplementation((req: any, res: any) => {
        res.status(500).json({ error: 'Server error' });
      });

      const response = await request(app).get('/words');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Server error' });
    });
  });

  describe('GET /words/:word', () => {
    it('should return the word details with status 200', async () => {
      const mockWord = { word: 'test', synonyms: ['example', 'sample'] };

      wordsController.getWordByName.mockImplementation((req: any, res: any) => {
        res.status(200).json(mockWord);
      });

      const response = await request(app).get('/words/test');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockWord);
    });

    it('should return 404 if word is not found', async () => {
      wordsController.getWordByName.mockImplementation((req: any, res: any) => {
        res.status(404).json({ message: 'Word not found' });
      });

      const response = await request(app).get('/words/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Word not found' });
    });
  });

  describe('POST /words', () => {
    it('should add a new word and return it with status 201', async () => {
      const newWord = { word: 'test', synonyms: ['example', 'sample'] };

      wordsController.addWord.mockImplementation((req: any, res: any) => {
        res.status(201).json(newWord);
      });

      const response = await request(app).post('/words').send(newWord);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newWord);
    });

    it('should return 400 if the request body is invalid', async () => {
      wordsController.addWord.mockImplementation((req: any, res: any) => {
        res.status(400).json({ message: 'Invalid data' });
      });

      const response = await request(app)
        .post('/words')
        .send({ invalidField: 'value' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid data' });
    });
  });

  describe('PUT /words/:word', () => {
    it('should update the word and return the updated data with status 200', async () => {
      const updatedWord = { word: 'test', synonyms: ['updated'] };

      wordsController.updateWord.mockImplementation((req: any, res: any) => {
        res.status(200).json(updatedWord);
      });

      const response = await request(app)
        .put('/words/test')
        .send({ synonyms: ['updated'] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedWord);
    });

    it('should return 404 if the word is not found for update', async () => {
      wordsController.updateWord.mockImplementation((req: any, res: any) => {
        res.status(404).json({ message: 'Word not found' });
      });

      const response = await request(app)
        .put('/words/nonexistent')
        .send({ synonyms: ['updated'] });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Word not found' });
    });
  });

  describe('DELETE /words/:word', () => {
    it('should delete the word and return status 204', async () => {
      wordsController.removeWord.mockImplementation((req: any, res: any) => {
        res.status(204).send();
      });

      const response = await request(app).delete('/words/test');
      expect(response.status).toBe(204);
    });

    it('should return 404 if the word is not found for deletion', async () => {
      wordsController.removeWord.mockImplementation((req: any, res: any) => {
        res.status(404).json({ message: 'Word not found' });
      });

      const response = await request(app).delete('/words/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Word not found' });
    });
  });
});
