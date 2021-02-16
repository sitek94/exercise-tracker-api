import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/user';

const baseUrl = '/api/exercise';

afterEach(() => {
  mongoose.connection.db.dropDatabase();
});

describe('/api/exercise', () => {
  describe('POST /new-user', () => {
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
  });

  describe('GET /users', () => {
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

  describe('POST /add', () => {
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

    it('adds new exercise with current date when date is not specified', async () => {
      const userRes = await request(app).post(`${baseUrl}/new-user`).send({
        username: 'test-user-one',
      });

      const { _id, username } = userRes.body;
      const expected = {
        _id,
        username,
        description: 'test',
        duration: 60,
        date: new Date().toDateString(),
      };

      const exerciseRes = await request(app).post(`${baseUrl}/add`).send({
        userId: expected._id,
        description: expected.description,
        duration: expected.duration,
      });

      expect(exerciseRes.body).toEqual(expected);
    });

    it('returns status 400 when user is not found', async (done) => {
      const res = await request(app).post(`${baseUrl}/add`).send({
        userId: 'test-user-id',
        description: 'test-desc',
        duration: 60,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/user not found/i);

      done();
    });
  });

  describe('GET /log', () => {
    it('successfully logs exercise when using "from", "to" and "limit" query params', async () => {
      const userRes = await request(app).post(`${baseUrl}/new-user`).send({
        username: 'test-user-one',
      });

      const { _id, username } = userRes.body;
      const exerciseOne = {
        _id,
        username,
        description: 'test',
        duration: 60,
        date: 'Wed Jan 01 2020',
      };
      const exerciseTwo = {
        _id,
        username,
        description: 'test',
        duration: 60,
        date: 'Thu Jan 02 2020',
      };

      await request(app).post(`${baseUrl}/add`).send({
        userId: exerciseOne._id,
        description: exerciseOne.description,
        duration: exerciseOne.duration,
        date: '2020-01-01',
      });

      await request(app).post(`${baseUrl}/add`).send({
        userId: exerciseTwo._id,
        description: exerciseTwo.description,
        duration: exerciseTwo.duration,
        date: '2020-01-02',
      });

      const logRes = await request(app).get(`${baseUrl}/log`).query({
        userId: _id,
        from: '2019-12-31',
        to: '2020-01-02',
        limit: 2,
      });

      expect(logRes.body._id).toBe(_id);
      expect(logRes.body.username).toBe(username);
      expect(logRes.body.count).toBe(2);
      expect(logRes.body.log.length).toBe(2);
    });

    it('successfully logs all exercises when using only "userId"', async () => {
      const userRes = await request(app).post(`${baseUrl}/new-user`).send({
        username: 'test-user-one',
      });

      const { _id, username } = userRes.body;
      const exerciseOne = {
        _id,
        username,
        description: 'test',
        duration: 60,
        date: 'Wed Jan 01 2020',
      };
      const exerciseTwo = {
        _id,
        username,
        description: 'test',
        duration: 60,
        date: 'Thu Jan 02 2020',
      };

      await request(app).post(`${baseUrl}/add`).send({
        userId: exerciseOne._id,
        description: exerciseOne.description,
        duration: exerciseOne.duration,
        date: '2020-01-01',
      });

      await request(app).post(`${baseUrl}/add`).send({
        userId: exerciseTwo._id,
        description: exerciseTwo.description,
        duration: exerciseTwo.duration,
        date: '2020-01-02',
      });

      const logRes = await request(app).get(`${baseUrl}/log`).query({
        userId: _id,
      });

      expect(logRes.body._id).toBe(_id);
      expect(logRes.body.username).toBe(username);
      expect(logRes.body.count).toBe(2);
      expect(logRes.body.log.length).toBe(2);
    });

    it('returns status 400 when user is not found', async (done) => {
      const res = await request(app).get(`${baseUrl}/log`).query({
        userId: 'test-user-id',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/user not found/i);

      done();
    });
  });
});
