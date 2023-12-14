const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
    .route('/register')
    .post(userController.userRegister)

router
    .route('/login')
    .post(userController.userLogin)

router
    .route('/:user_id')
    .all(jwtMiddleware.verifiyToken)
    .delete(userController.deleteUser)
    .put(userController.putUser)
    .patch(userController.patchUser)
    .get(userController.getUser)

router 
    .route('/:user_id/groups/')
    .all(jwtMiddleware.verifiyToken)
    .get(userController.getInfoGroup)
    .post(userController.createGroup)
    .delete(userController.deleteGroup)
    .patch(userController.patchGroup)
    .put(userController.putGroup)

module.exports = router;