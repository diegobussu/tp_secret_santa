const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const chai = require('chai');
const expect = chai.expect;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0:27017/tp_secret_santa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

// Schéma pour le modèle User
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Modèle User
const UserModel = mongoose.model('User', userSchema);

// Configuration de la route Register
app.post('/users/register/', async (req, res) => {
  const { email, password } = req.body;

  // Hachage du mot de passe avant de le sauvegarder
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({ email, password: hashedPassword });
  await user.save();

  res.status(200).json({ email, password: hashedPassword });
});

// Configuration de la route Login
app.post('/users/login/', async (req, res) => {
  const { email, password } = req.body;

  // Recherche de l'utilisateur dans la base de données
  const user = await UserModel.findOne({ email });

  // Vérification du mot de passe en comparant le hachage stocké
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({ email, password });
  } else {
    res.status(401).json({ message: 'Identifiants invalides' });
  }
});


let hashedPassword; 

// Tests unitaires pour les utilisateurs
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

        // Vérification des données de retour
        expect(email).to.equal('testuser@example.com');
        expect(password).to.not.equal('testpassword'); // Le mot de passe doit être haché

        hashedPassword = password;

        // Vérification de l'enregistrement dans la base de données
        const user = await UserModel.findOne({ email });
        expect(user).to.exist;
        expect(user.email).to.equal('testuser@example.com');
        
        // Vérification du mot de passe haché dans la base de données
        const passwordMatch = await bcrypt.compare('testpassword', user.password);
        expect(passwordMatch).to.be.true;

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
      .end(async (err, res) => {
        if (err) return done(err);
  
        const { email, password } = res.body;
  
        // Vérification des données de retour
        expect(email).to.equal('testuser@example.com');
        expect(password).to.not.equal(hashedPassword); // Update to the hashed password
  
        // Vérification de l'enregistrement dans la base de données
        const user = await UserModel.findOne({ email });
        expect(user).to.exist;
        expect(user.email).to.equal('testuser@example.com');
        
        // Vérification du mot de passe haché dans la base de données
        const passwordMatch = await bcrypt.compare('testpassword', user.password);
        expect(passwordMatch).to.be.true;
  
        done();
      });
  });
});
