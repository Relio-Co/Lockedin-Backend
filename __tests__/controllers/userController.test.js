const request = require('supertest');
const express = require('express');
const userController = require('../../controllers/userController');
const { sequelize, User } = require('../../models');

const app = express();
app.use(express.json());
app.use('/users', userController);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Controller', () => {
  test('should create a new user', async () => {
    const response = await request(app)
      .post('/users/create')
      .send({ email: 'test@example.com', username: 'testuser', uid: '12345' });
    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe('test@example.com');
  });

  test('should get a user by id', async () => {
    const user = await User.create({ email: 'getuser@example.com', username: 'getuser', uuid: '12346' });
    const response = await request(app).get(`/users/${user.user_id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe('getuser@example.com');
  });

  test('should update a user', async () => {
    const user = await User.create({ email: 'updateuser@example.com', username: 'updateuser', uuid: '12347' });
    const response = await request(app)
      .put(`/users/${user.user_id}`)
      .send({ email: 'updated@example.com' });
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe('updated@example.com');
  });

  test('should delete a user', async () => {
    const user = await User.create({ email: 'deleteuser@example.com', username: 'deleteuser', uuid: '12348' });
    const response = await request(app).delete(`/users/${user.user_id}`);
    expect(response.statusCode).toBe(204);
  });
});
