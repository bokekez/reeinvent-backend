const request = require('supertest');
const express = require('express');
const wordsRouter = require('../routes/words'); 
const wordsController = require('../controllers/words'); 

const app = express();
app.use(express.json()); 
app.use('/words', wordsRouter);

jest.mock('../controllers/words');

describe('Words API', () => {

  describe('GET /words/:word', () => {
    it('should return the word details with status 200', async () => {
      const mockWord = { word: 'test', synonyms: ['example', 'sample'] };

      wordsController.getWordByName.mockImplementation((req, res) => {
        res.status(200).json(mockWord);
      });

      const response = await request(app).get('/words/test');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockWord);
    });

    it('should return 404 if word is not found', async () => {
      wordsController.getWordByName.mockImplementation((req, res) => {
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

      wordsController.addWord.mockImplementation((req, res) => {
        res.status(201).json(newWord);
      });

      const response = await request(app)
        .post('/words')
        .send(newWord);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newWord);
    });

    it('should return 400 if the request body is invalid', async () => {
      wordsController.addWord.mockImplementation((req, res) => {
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

      wordsController.updateWord.mockImplementation((req, res) => {
        res.status(200).json(updatedWord);
      });

      const response = await request(app)
        .put('/words/test')
        .send({ synonyms: ['updated'] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedWord);
    });

    it('should return 404 if the word is not found for update', async () => {
      wordsController.updateWord.mockImplementation((req, res) => {
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
      wordsController.removeWord.mockImplementation((req, res) => {
        res.status(204).send(); 
      });

      const response = await request(app).delete('/words/test');
      expect(response.status).toBe(204);
    });

    it('should return 404 if the word is not found for deletion', async () => {
      wordsController.removeWord.mockImplementation((req, res) => {
        res.status(404).json({ message: 'Word not found' });
      });

      const response = await request(app).delete('/words/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Word not found' });
    });
  });

});
