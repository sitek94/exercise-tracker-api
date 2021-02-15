import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/user';

const baseUrl = '/api/exercise';

afterEach(() => {
  mongoose.connection.db.dropDatabase();
});

describe('/api/exercise', () => {
  describe(`${baseUrl}/new-user`, () => {
    it('successfully adds a new user', async () => {
      const res = await request(app).post(`${baseUrl}/new-user`).send({
        username: 'test-user',
      });

      expect(res.body.username).toBe('test-user');
      expect(res.body._id).toBeTruthy();
    });

    it(`throws error when username is taken`, async () => {
      try {
        await request(app).post(`${baseUrl}/new-user`).send({
          username: 'test-user',
        });

        await request(app).post(`${baseUrl}/new-user`).send({
          username: 'test-user',
        });
      } catch (e) {
        expect(e.message).toMatch(/username taken/i);
      }
    });

    describe('/users', () => {
      it('successfully logs all users', async () => {
        await request(app).post(`${baseUrl}/new-user`).send({
          username: 'test-user-one',
        });
        await request(app).post(`${baseUrl}/new-user`).send({
          username: 'test-user-two',
        });

        const usersRes = await request(app).get(`${baseUrl}/users`);

        expect(usersRes.status).toBe(200);
        expect(usersRes.body.length).toBe(2);
      });

      it('returns error when failed to find the users', async (done) => {
        jest.spyOn(User, 'find').mockRejectedValue(new Error('test'));

        const res = await request(app).get(`${baseUrl}/users`);
        expect(res.body.error).toBe('test');

        done();
      });
    });

    describe('/add', () => {
      it('successfully adds new exercise', async () => {
        const userRes = await request(app).post(`${baseUrl}/new-user`).send({
          username: 'test-user-one',
        });

        const { _id, username } = userRes.body;
        const expected = {
          _id,
          username,
          description: 'test',
          duration: 60,
          date: 'Wed Jan 01 2020',
        };

        const exerciseRes = await request(app).post(`${baseUrl}/add`).send({
          userId: expected._id,
          description: expected.description,
          duration: expected.duration,
          date: '2020-01-01',
        });

        expect(exerciseRes.body).toEqual(expected);
      });
    });
  });
});
