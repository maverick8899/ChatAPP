/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: API to manage chats
 */

/**
 * @swagger
 *   /:
 *     post:
 *       summary: accessChat
 *       tags: [Chats]
 *       responses:
 *         "200":
 *           description: The list of chats
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Chats'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 */

/**
 * @swagger
 *   /:
 *     get:
 *       summary: fetchChats
 *       tags: [Chats]
 *       responses:
 *         "200":
 *           description: The list of chats
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Chats'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 */
const router = require('express').Router();
const chatController = require('../../controllers/Chat.controller');
//
router.route('/').post(chatController.accessChat).get(chatController.fetchChats);
router.route('/group_create').post(chatController.createGroupChat);
router.route('/group_rename').put(chatController.renameGroup);
router.route('/group_add').put(chatController.addToGroup);
router.route('/group_remove').put(chatController.removeFromGroup);
router.get('/search', chatController.fetchAllUsers);

module.exports = router;
