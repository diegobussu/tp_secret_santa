const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');
const chai = require('chai');
const expect = chai.expect;

const app = express();
app.use(bodyParser.json());

app.post('/users/register/', (req, res) => {
    const { email, password } = req.body;
    res.status(200).json({ email, password });
});

app.post('/users/login/', (req, res) => {
  const { email, password } = req.body;
  res.status(200).json({ email, password });
});

describe('Users Unit Test', () => {
    it('User Register', (done) => {
        request(app)
            .post('/users/register/')
            .send({
                email: 'azerty',
                password: 'azerty'
            })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                const { email, password } = res.body;

                expect(email).to.equal('azerty');
                expect(password).to.equal('azerty');

                done();
            });
    });

    it('User Login', (done) => {
      request(app)
          .post('/users/login/')
          .send({
              email: 'azerty',
              password: 'azerty'
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
              if (err) return done(err);

              const { email, password } = res.body;

              expect(email).to.equal('azerty');
              expect(password).to.equal('azerty');

              done();
          });
  });
});
