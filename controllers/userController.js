const User = require('../models/userModel');
const Group = require('../models/groupModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // afin de comparer le hash du mot de passe
require('dotenv').config();

// méthode pour s'inscrire
exports.userRegister = async (req, res) => {
    try {
        // Vérifier si l'emailest unique
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Cet email existe déjà.' });
        }

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
            return res.status(400).json({ message: 'Cet email existe déjà.' });
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
            return res.status(400).json({ message: 'Cet email existe déjà.' });
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

        // Vérifie si l'utilisateur a le rôle "admin" dans le groupe spécifié
        const isAdmin = group.users.some(u => u.user_id === userId && u.role === 'admin');

        if (!isAdmin) {
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
        const userId = req.params.user_id;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifier si le nom du groupe est unique
        const existingGroup = await Group.findOne({ name: req.body.name });
        if (existingGroup) {
            return res.status(400).json({ message: 'Le nom du groupe doit être unique.' });
        }

        // Créer un nouveau groupe avec l'utilisateur comme administrateur
        const newGroup = new Group({ ...req.body, users: [{ user_id: userId, role: 'admin' }] });
        const group = await newGroup.save();

        res.status(201).json({ message: `Groupe créé ! id : ${group.id}, role : ${group.role}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// méthode pour supprimer un groupe
exports.deleteGroup = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const groupId = req.params.group_id;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifier si le groupe existe
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé.' });
        }

        // Vérifier si l'utilisateur a le rôle "admin" dans le groupe spécifié
        const isAdmin = group.users.some(u => u.user_id === userId && u.role === 'admin');
        if (!isAdmin) {
            return res.status(403).json({ message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.' });
        }

        // Si l'utilisateur est admin dans le groupe, supprimer le groupe
        await Group.findByIdAndDelete(groupId);
        res.status(200).json({ message: 'Groupe supprimé avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// méthode pour envoyer une invitation
exports.addInvitation = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const groupId = req.params.group_id;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifier si l'utilisateur a le rôle "admin" dans le groupe spécifié
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé.' });
        }

        const isAdmin = group.users.some(u => u.user_id === userId && u.role === 'admin');
        if (!isAdmin) {
            return res.status(403).json({ message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.' });
        }

        // Si l'utilisateur est admin dans le groupe, générer un token de 1h
        const invitToken = await jwt.sign({ groupId, userId }, process.env.JWT_KEY_INVIT, { expiresIn: '1h' });

        // Envoyer une invitation à tous les utilisateurs en BDD (ajouter une logique ici si nécessaire)

        res.status(200).json({ message: 'Invitation envoyée avec succès.', invitToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// méthode pour accepter une invitation
exports.acceptInvit = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const groupId = req.params.group_id;
        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        // Vérifiez si le groupe existe
        const groupExists = await Group.findById(groupId);

        if (!groupExists) {
            return res.status(404).json({ message: 'Le groupe n\'existe pas.' });
        }

        // Vérifiez si l'utilisateur n'est pas déjà dans le groupe
        const userInGroup = await Group.findOne({ _id: groupId, 'users.user_id': userId });

        if (userInGroup) {
            return res.status(400).json({ message: 'L\'utilisateur est déjà dans le groupe.' });
        }

        // Vérifiez si l'utilisateur a refusé l'invitation
        const userRefusedInvitation = user.refuseInvit;

        if (userRefusedInvitation == true) {
            return res.status(400).json({ message: 'Vous ne pouvez accepter une invitation que vous avez précédemment refusée.' });
        }

        // Ajoutez l'utilisateur au groupe avec le rôle 'user'
        await Group.findByIdAndUpdate(groupId, { $addToSet: { users: { user_id: userId, role: 'user' } } });

        res.status(200).json({ message: 'Invitation acceptée avec succès. Vous avez été ajouté dans le groupe.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};




// méthode pour refuser une invitation
exports.declineInvit = async (req, res) => {
    try {
        const userId= req.params.user_id;
        const groupId = req.params.group_id;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifiez si le groupe existe
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Le groupe n\'existe pas.' });
        }

        // Vérifiez si l'utilisateur est dans le groupe
        const userInGroup = group.users.some(u => u.user_id === userId);

        if (userInGroup) {
            return res.status(400).json({ message: 'L\'utilisateur est déjà dans le groupe.' });
        }

        // Mettre à jour la propriété refuseInvit à true dans le schéma de l'utilisateur
        user.refuseInvit = true;
        await user.save();
        
        res.status(200).json({ message: 'Invitation refusée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


