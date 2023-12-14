const User = require('../models/userModel');
const Group = require('../models/groupModel');
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
        const user = await User.findById(req.params.user_id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

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
        // Vérifier si l'emailest unique
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ message: 'L email doit être unique.' });
        }

        const user = await User.findByIdAndUpdate(req.params.user_id, req.body, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Erreur serveur'});
    }
};

// méthode pour modifier un utilisateur
exports.patchUser = async (req, res) => {
    try {
        // Vérifier si l'emailest unique
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ message: 'L email doit être unique.' });
        }

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

// methode pour les infos d'un groupe
exports.getInfoGroup = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const groupId = req.params.group_id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifie si l'utilisateur a le rôle "admin" dans le groupe spécifié
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé.' });
        }

        if (group.user_id !== userId || group.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.' });
        }

        // Si l'utilisateur est admin dans le groupe, renvoyer les informations du groupe
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

// methode pour créer un groupe
exports.createGroup = async (req, res) => {
    try {
        await User.findById(req.params.user_id);

        // Vérifier si le nom du groupe est unique
        const existingGroup = await Group.findOne({ name: req.body.name });
        if (existingGroup) {
            return res.status(400).json({ message: 'Le nom du groupe doit être unique.' });
        }

        const newGroup = new Group({...req.body, user_id: req.params.user_id});
        try {
            const group = await newGroup.save();
            group.role = 'admin';
            await group.save();
            res.status(201).json({ message: `Groupe créé ! id : ${group.id}, role : ${group.role}` });  
        } catch (error) {
            res.status(500).json({message: 'Erreur serveur'});
        }
    } catch (error) {
        res.status(500).json({message: 'Utilisateur non trouvé.'});
    }
};

// méthode pour supprimer un groupe
exports.deleteGroup = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const groupId = req.params.group_id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifie si l'utilisateur a le rôle "admin" dans le groupe spécifié
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé.' });
        }

        if (group.user_id !== userId || group.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.' });
        }

        // Si l'utilisateur est admin dans le groupe, supprimer le groupe
        await Group.findByIdAndDelete(req.params.group_id);
        res.status(200).json({ message: 'Groupe supprimé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// méthode pour modifier partiellement un groupe
exports.putGroup = async (req, res) => {
    try {
        // Vérifier si le nom du groupe est unique
        const existingGroup = await Group.findOne({ name: req.body.name });
        if (existingGroup) {
            return res.status(400).json({ message: 'Le nom du groupe doit être unique.' });
        }
        
        const userId = req.params.user_id;
        const groupId = req.params.group_id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifie si l'utilisateur a le rôle "admin" dans le groupe spécifié
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé.' });
        }

        if (group.user_id !== userId || group.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.' });
        }

        // Si l'utilisateur est admin dans le groupe, modifier les informations du groupe

        await Group.findByIdAndUpdate(req.params.group_id, req.body, {new: true});
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({message: 'Erreur serveur'});
    }
};

// méthode pour modifier un groupe
exports.patchGroup = async (req, res) => {
    try {
        // Vérifier si le nom du groupe est unique
        const existingGroup = await Group.findOne({ name: req.body.name });
        if (existingGroup) {
            return res.status(400).json({ message: 'Le nom du groupe doit être unique.' });
        }

        const userId = req.params.user_id;
        const groupId = req.params.group_id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifie si l'utilisateur a le rôle "admin" dans le groupe spécifié
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé.' });
        }

        if (group.user_id !== userId || group.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.' });
        }

        // Si l'utilisateur est admin dans le groupe, modifier les informations du groupe

        group = await Group.findByIdAndUpdate(req.params.group_id, req.body, {new: true});
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({message: 'Erreur serveur'});
    }
};

// méthode pour envoyer une invitation
exports.addInvitation = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const groupId = req.params.group_id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifie si l'utilisateur a le rôle "admin" dans le groupe spécifié
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé.' });
        }

        if (group.user_id !== userId || group.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.' });
        }

        // Si l'utilisateur est admin dans le groupe, envoyer une invitation à tous les users en BDD + générer un token de 1h

        const token = await jwt.sign({ groupId, userId }, process.env.JWT_KEY_INVIT, { expiresIn: '1h' });

        res.status(200).json({ message: 'Invitation envoyée avec succès.', token });
    } catch (error) {
        res.status(500).json({message: 'Erreur serveur'});
    }
};


// méthode pour accepter une invitation
exports.acceptInvit = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const groupId = req.params.group_id;

        const user = await User.findById(userId);
        const group = await Group.findById(groupId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        if (group.user_id == userId || group.role == 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Vous ne pouvez pas accepter une invitation de votre propre groupe.' });
        }

        // Ajouter l'utilisateur au groupe et lui attribuer le rôle "user"
        group.role = 'admin';

        await group.save();

        res.status(200).json({ message: 'Invitation acceptée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// méthode pour refuser une invitation
exports.declineInvit = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const groupId = req.params.group_id;

        const user = await User.findById(userId);
        const group = await Group.findById(groupId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        if (group.user_id == userId || group.role == 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Vous ne pouvez pas refuser une invitation de votre propre groupe.' });
        }

        res.status(200).json({ message: 'Invitation refusée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
