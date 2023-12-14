const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // afin de comparer le hash du mot de passe
require('dotenv').config();

// méthode pour s'inscrire
exports.userRegister = async (req, res) => {
    try {
        let newUser = new User(req.body);
        let user = await newUser.save();
        res.status(201).json({ message: `Utilisateur créé : ${user.email}, id : ${user.id}` });        
    } 
    catch (error) {
        console.log(error);
        res.status(401).json({message: 'Requete invalide'});
    }
};

// méthode pour se connecter
exports.userLogin = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            res.status(500).json({message: 'Utilisateur non trouvé'});
            return;
        }

        // on compare le mot de passe avec le hash en BDD
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if(user.email == req.body.email && validPassword && user.role == req.body.role) {
            let userData = {
                id: user._id,
                email: user.email,
                role: user.role,
            };

            const token = await jwt.sign(userData, process.env.JWT_KEY, {expiresIn: "10h"});
            res.status(200).json({token});
            }
        else {
            res.status(401).json({message: "Email ou mot de passe ou rôle incorrect."});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Une erreur s'est produite lors du traitement."})
    }
};

// méthode pour supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.user_id);
        res.status(200).json({message: 'Utilisateur supprimé'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Erreur serveur'});
    }
};

// méthode pour modifier partiellement un utilisateur
exports.putUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.user_id, req.body, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Erreur serveur'});
    }
};

// méthode pour modifier un utilisateur
exports.patchUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.user_id, req.body, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Erreur serveur'});
    }
};

// méthode pour avoir les informations d'un utilisateur
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id);
        res.status(200).json({ message: `Utilisateur trouvé id : ${user.id}, email : ${user.email}, role : ${user.role}` });  
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Erreur serveur'});
    }
};