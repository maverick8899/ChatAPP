const router = require('express').Router();
const { sendMessage, allMessages } = require('../../controllers/Message.controller');

router.route('/:chatId').get(allMessages);
router.route('/').post(sendMessage);

module.exports = router;
