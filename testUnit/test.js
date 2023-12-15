const request = require('supertest');
const app = require('express');
const mongoose = require('mongoose');

const mockUser = {
  email: 'testuser@example.com',
  password: 'testpassword',
};

describe('User Routes', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('register a new user', async () => {
    const response = await request(app)
      .post('/users/register')
      .send(mockUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  it('login a user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send(mockUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('get user details', async () => {
    const userId = 'someUserId';
    const response = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', 'Bearer yourAuthToken');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('email', mockUser.email);
  });
});
