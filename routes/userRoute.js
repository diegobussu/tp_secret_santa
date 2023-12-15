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
    .all(jwtMiddleware.verifyToken)
    .delete(userController.deleteUser)
    .put(userController.putUser)
    .patch(userController.patchUser)
    .get(userController.getUser)

router 
    .route('/:user_id/groups/')
    .all(jwtMiddleware.verifyToken)
    .post(userController.createGroup)

router 
    .route('/:user_id/groups/:group_id')
    .all(jwtMiddleware.verifyToken)
    .get(userController.getInfoGroup)
    .delete(userController.deleteGroup)

router  
    .route('/:user_id/groups/:group_id/invitation')
    .all(jwtMiddleware.verifyToken)
    .post(userController.addInvitation)

router
    .route('/:user_id/groups/:group_id/invitation/accept')
    .all(jwtMiddleware.verifyToken, jwtMiddleware.verifyTokenInvit)
    .post(userController.acceptInvit)

router
    .route('/:user_id/groups/:group_id/invitation/decline')
    .all(jwtMiddleware.verifyToken, jwtMiddleware.verifyTokenInvit)
    .post(userController.declineInvit)

module.exports = router;