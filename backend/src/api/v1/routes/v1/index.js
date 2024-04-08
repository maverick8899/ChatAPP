const express = require('express');
const router = express.Router();

const chatRoute = require('./Chat.route');
const authRoute = require('./Auth.route');
const MessRoute = require('./Message.route');
const authController = require('../../controllers/Auth.controller');

//
router.use('/auth', authRoute);
router.use('/chat', authController.verifyAccessToken, chatRoute);
router.use('/message', authController.verifyAccessToken, MessRoute);

module.exports = router;
