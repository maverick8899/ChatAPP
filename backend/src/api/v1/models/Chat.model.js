const mongoose = require('mongoose');
const { connectChatAPP } = require('../../../configs/connections_mongDB');
const chatSchema = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        picture: {
            type: 'String',
            default:
                'https://res.cloudinary.com/dgiozc0lj/image/upload/v1688391751/64a22b8d4cc43_s7kxte.png',
        },
    },
    { timestamps: true },
);

module.exports = connectChatAPP.model('Chat', chatSchema);
