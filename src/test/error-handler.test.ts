import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import User from '../models/user';

afterEach(() => {
  mongoose.connection.db.dropDatabase();
});

describe('errorHandler', () => {
  it('handles incorrect types of query parameters', async () => {
    const userRes = await request(app).post(`/api/exericse/new-user`).send({
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

    const res = await request(app).post(`/api/exercise/add`).send({
      userId: exerciseOne._id,
      description: exerciseOne.description,
      duration: 'it-should-be-a-number',
      date: '2020-01-01',
    });

    expect(res.status).toBe(400);
  });

  it('handles random error', async () => {
    jest
      .spyOn(User.prototype, 'save')
      .mockImplementationOnce(() => Promise.reject(new Error('test')));

    const res = await request(app).post(`/api/exercise/new-user`).send({
      username: 'test-user-one',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/test/i);
  });
});
