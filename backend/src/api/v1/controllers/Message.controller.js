const Message = require('../models/Message.model');
const User = require('../models/User.model');
const Chat = require('../models/Chat.model');

module.exports = {
    //@description     Create New Message
    //@route           POST /api/Message/
    //@access          Protected
    async sendMessage(req, res, next) {
        const { content, chatId } = req.body;
        if (!content || !chatId) return res.status(400).json('Invalid data passed into request');

        let newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };

        try {
            let message = await Message.create(newMessage);

            message = await message.populate('sender', 'name picture');
            message = await message.populate('chat');
            message = await User.populate(message, {
                path: 'chat.users',
                select: 'name picture email',
            });
            console.log('message'.green, message);
            // latestMessage sẽ tự refer đến ObjectId_message và cập nhật message_instance
            await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
            res.status(200).json(message);
            //
        } catch (error) {
            next(error);
        }
    },
    //@description     Get all Messages
    //@route           GET /api/Message/:chatId
    //@access          Protected
    async allMessages(req, res, next) {
        try {
            await Message.find({ chat: req.params.chatId })
                .populate('sender', 'name picture email')
                .populate('chat')
                .then((result) => res.status(200).json(result));
            //
        } catch (error) {
            next(error);
        }
    },
};
