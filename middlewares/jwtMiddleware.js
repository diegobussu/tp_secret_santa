const jwt = require('jsonwebtoken');
require('dotenv').config();

// méthode pour vérifier le token d'un utilisateur
exports.verifiyToken = async (req, res, next) => {
    try {
        const token = req.header('authorization');

        if (token !== undefined) {
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                    if(error) {
                        reject(error);
                    }
                    else {
                        resolve(decoded);
                    }
                });
            });
            req.user = payload;
            next();
        } 
        else {
            res.status(403).json({message: 'Accès interdit : token manquant'});
        }
    }
    catch (error) {
        console.log(error);
        res.status(403).json({message: "Accès interdit : token invalide"});

    }
}

// methode pour vérifier le token de l'invitation
exports.verifiyTokenInvit = async (req, res, next) => {
    try {
        const token = req.header('authorization');

        if (token !== undefined) {
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_KEY_INVIT, (error, decoded) => {
                    if(error) {
                        reject(error);
                    }
                    else {
                        resolve(decoded);
                    }
                });
            });
            req.user = payload;
            next();
        } 
        else {
            res.status(403).json({message: 'Accès interdit : token manquant'});
        }
    }
    catch (error) {
        console.log(error);
        res.status(403).json({message: "Accès interdit : token invalide"});

    }
}