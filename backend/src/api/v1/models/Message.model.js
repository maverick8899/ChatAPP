const mongoose = require('mongoose');
const { connectChatAPP } = require('../../../configs/connections_mongDB');
//
const messageSchema = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
        // readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true },
);

module.exports = connectChatAPP.model('Message', messageSchema);
