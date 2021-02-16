import request from 'supertest';
import app from '../app';

describe('app', () => {
  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /random-url', () => {
    it('should return 404 Not Found', async (done) => {
      const res = await request(app).get('/random-url');

      expect(res.status).toBe(404);

      done();
    });
  });
});
