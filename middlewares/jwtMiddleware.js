const jwt = require('jsonwebtoken');
require('dotenv').config();

// méthode pour vérifier le token d'un utilisateur
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.header('authorization_login');

        if (token !== undefined) {
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                });
            });

            // vérifier le token par rapport à un user id
            if (payload.id == req.params.user_id) {
                req.user = payload;
                next();
            } else {
                res.status(403).json({ message: 'Accès interdit : token invalide pour cet utilisateur' });
            }
        } else {
            res.status(403).json({ message: 'Accès interdit : token manquant' });
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: 'Accès interdit : token invalide' });
    }
};




// methode pour vérifier le token de l'invitation
exports.verifyTokenInvit = async (req, res, next) => {
    try {
        const token = req.header('authorization_invit');

        if (token !== undefined) {
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_KEY_INVIT, (error, decoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                });
            });

            // vérifier le token via group id
            if (payload.groupId === req.params.group_id) {
                req.user = payload;
                next();
            } else {
                res.status(403).json({ message: 'Accès interdit : token invalide pour cette invitation' });
            }
        } else {
            res.status(403).json({ message: 'Accès interdit : token manquant' });
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: 'Accès interdit : token invalide' });
    }
};
