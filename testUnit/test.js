const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const chai = require('chai');
const expect = chai.expect;
const bodyParser = require('body-parser'); // Importation du module Body-parser pour parser les requêtes JSON

const app = express();
app.use(bodyParser.json());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/tp_secret_santa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

// Définition du schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const UserModel = mongoose.model('User', userSchema);

// Définition du schéma du groupe
const groupSchema = new mongoose.Schema({
  name: String,
  users: [
    {
      user_id: String,
      role: String,
    },
  ],
});

const GroupModel = mongoose.model('Group', groupSchema);

const secretKey = 'your_secret_key'; // Clé secrète pour signer les tokens JWT

// Route pour enregistrer un nouvel utilisateur
app.post('/users/register/', async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({ email, password: hashedPassword });
  await user.save();

  res.status(200).json({ email, password: hashedPassword });
});

// Route pour connecter un utilisateur
app.post('/users/login/', async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ email: user.email, id: user._id }, secretKey, {
      expiresIn: '1h',
    });
    res.status(200).json({ email, token });
  } else {
    res.status(401).json({ message: 'Identifiants invalides' });
  }
});

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });

    req.userId = decoded.id;
    next();
  });
};

// Route pour créer un groupe
app.post('/user_id/groups/', verifyToken, async (req, res) => {
  const { name, users } = req.body;

  const group = new GroupModel({ name, users });
  await group.save();

  res.status(201).json({ name, users });
});

let token;
let hashedPassword;


// Tests unitaires pour les utilisateurs
describe('Users Unit Test', () => {
  it('User Register', (done) => {
    request(app)
      .post('/users/register/')
      .send({
        email: 'jokonito06@gmail.com',
        password: 'Abcde06*',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);

        const { email, password } = res.body;
        expect(email).to.equal('jokonito06@gmail.com');
        expect(password).to.not.equal('Abcde06*');

        hashedPassword = password;
        const user = await UserModel.findOne({ email });
        expect(user).to.exist;
        expect(user.email).to.equal('jokonito06@gmail.com');
        
        const passwordMatch = await bcrypt.compare('Abcde06*', user.password);
        expect(passwordMatch).to.be.true;

        done();
      });
  });

  it('User Login', (done) => {
    request(app)
      .post('/users/login/')
      .send({
        email: 'jokonito06@gmail.com',
        password: 'Abcde06*',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
  
        const { email, token: loginToken } = res.body;
        expect(email).to.equal('jokonito06@gmail.com');
        
        token = loginToken;
  
        const user = await UserModel.findOne({ email });
        expect(user).to.exist;
        expect(user.email).to.equal('jokonito06@gmail.com');
        
        const passwordMatch = await bcrypt.compare('Abcde06*', user.password);
        expect(passwordMatch).to.be.true;
  
        done();
      });
  });
});

// Tests unitaires pour les groupes
describe('Group Unit Test', () => {
  it('Create Group', (done) => {
    request(app)
      .post('/user_id/groups/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Groupe n°1',
        users: [
          {
            user_id: 'jokonito06@gmail.com',
            role: 'admin',
          },
        ],
      })
      .set('Accept', 'application/json')
      .expect(201)
      .end(async (err, res) => {
        if (err) return done(err);

        const { name, users } = res.body;

        expect(name).to.equal('Groupe n°1');
        expect(users).to.be.an('array').that.is.not.empty;
        expect(users[0].user_id).to.equal('jokonito06@gmail.com');
        expect(users[0].role).to.equal('admin');

        const group = await GroupModel.findOne({ name });
        expect(group).to.exist;
        expect(group.name).to.equal('Groupe n°1');
        expect(group.users).to.be.an('array').that.is.not.empty;
        expect(group.users[0].user_id).to.equal('jokonito06@gmail.com');
        expect(group.users[0].role).to.equal('admin');

        done();
      });
  });
});
