const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for Secret Santa
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *     Group:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         role:
 *          type: boolean
 *       required:
 *         - name
 *         - role
 */

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
    .post(userController.createGroup)

router 
    .route('/:user_id/groups/:group_id')
    .all(jwtMiddleware.verifiyToken)
    .get(userController.getInfoGroup)
    .delete(userController.deleteGroup)

router  
    .route('/:user_id/groups/:group_id/invitation')
    .all(jwtMiddleware.verifiyToken)
    .post(userController.addInvitation)

router
    .route('/:user_id/groups/:group_id/invitation/accept')
    .all(jwtMiddleware.verifiyTokenInvit)
    .post(userController.acceptInvit)

router
    .route('/:user_id/groups/:group_id/invitation/decline')
    .all(jwtMiddleware.verifiyTokenInvit)
    .post(userController.declineInvit)

module.exports = router;