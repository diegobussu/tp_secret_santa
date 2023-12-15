const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0:27017/tp_secret_santa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const UserModel = mongoose.model('User', userSchema);

app.post('/users/register/', async (req, res) => {
  const { email, password } = req.body;

  const user = new UserModel({ email, password });
  await user.save();

  res.status(200).json({ email, password });
});

app.post('/users/login/', async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email, password });

  if (user) {
    res.status(200).json({ email, password });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

describe('Users Unit Test', () => {
  it('User Register', (done) => {
    request(app)
      .post('/users/register/')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);

        const { email, password } = res.body;

        expect(email).to.equal('testuser@example.com');
        expect(password).to.equal('testpassword');

        const user = await UserModel.findOne({ email });
        expect(user).to.exist;
        expect(user.email).to.equal('testuser@example.com');
        expect(user.password).to.equal('testpassword');

        done();
      });
  });

  it('User Login', (done) => {
    request(app)
      .post('/users/login/')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const { email, password } = res.body;

        expect(email).to.equal('testuser@example.com');
        expect(password).to.equal('testpassword');

        done();
      });
  });
});
