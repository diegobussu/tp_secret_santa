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

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Utilisateur créé : user@example.com, id: 123'
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User login successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Utilisateur connecté : id: 123'
 */

/**
 * @swagger
 * /users/user_id:
 *   get:
 *     summary: Information of a user
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User informations successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Utilisateur informations : id : 123, email : user@example.com, role : admin/user'
 */

/**
 * @swagger
 * /users/user_id:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Deleted User successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Utilisateur supprimé !'
 */

/**
 * @swagger
 * /users/user_id:
 *   put:
 *     summary: Edit a user
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Edited User successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Utilisateur modifié !'
 */

/**
 * @swagger
 * /users/user_id:
 *   patch:
 *     summary: Edit a user
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Edited User successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Utilisateur modifié !'
 */

/**
 * @swagger
 * /users/user_id/groups/:
 *   post:
 *     summary: Create a group
 *     tags:
 *       - Groups
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: Created Group successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Groupe créé !'
 */

/**
 * @swagger
 * /users/user_id/groups/group_id:
 *   get:
 *     summary: Info for a group
 *     tags:
 *       - Groups
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: Informations for a Group successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Informations du groupe : !'
 */

/**
 * @swagger
 * /users/user_id/groups/group_id:
 *   delete:
 *     summary: Delete a group
 *     tags:
 *       - Groups
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: Deleted Group successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Groupe supprimé !'
 */

/**
 * @swagger
 * /users/user_id/groups/group_id/invitation:
 *   post:
 *     summary: Create invitation
 *     tags:
 *       - Invitation
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: Invitation created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Invitation créé !'
 */

/**
 * @swagger
 * /users/user_id/groups/group_id/invitation/accept:
 *   post:
 *     summary: Accepted invitation
 *     tags:
 *       - Invitation
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: Accepted invitation successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Invitation accepté !'
 */

/**
 * @swagger
 * /users/user_id/groups/group_id/invitation/decline:
 *   post:
 *     summary: Refused invitation
 *     tags:
 *       - Invitation
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: Refused invitation successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Invitation refusé !'
 */