const CreateError = require('http-errors');
const Chat = require('../models/Chat.model');
const User = require('../models/User.model');
//
module.exports = {
    //not group
    async accessChat(req, res, next) {
        try {
            const creatorChat = req.user;
            const { userChatId } = req.body;
            if (!userChatId) {
                throw CreateError.BadRequest('userChatId is not sent with request');
            }
            console.log('accessChat'.blue, { userChatId, req_user: req.user });

            // tìm kiếm cuộc trò chuyện mà hai người dùng cùng tham gia not group.
            let isChat = await Chat.find({
                isGroupChat: false,
                $and: [
                    { users: { $elemMatch: { $eq: creatorChat._id } } },
                    { users: { $elemMatch: { $eq: userChatId } } },
                ],
            })
                .populate('users', '-password')
                .populate('latestMessage');

            console.log('accessChat.isChat'.blue, isChat);

            //trả về users với name pic email từ isChat ở trên
            if (isChat) {
                // Mongoose sẽ tìm kiếm trường "sender" trong trường "latestMessage"
                //của đối tượng "isChat" và Join User.model vào đó.
                isChat = await User.populate(isChat, {
                    path: 'latestMessage.sender',
                    select: 'name picture email',
                });
            }

            if (isChat.length > 0) {
                return res.json({ ...isChat });
            } else {
                const createdChat = await Chat.create({
                    isGroupChat: false,
                    users: [creatorChat._id, userChatId],
                });

                const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                    'users',
                    '-password',
                );
                //trả về thông tin groupChat
                return res.status(200).json(FullChat);
            }
        } catch (error) {
            next(error);
        }
    },
    //lấy tất cả conversation của user_current
    async fetchChats(req, res, next) {
        const curUser = req.user;
        //use eq vì các item in users nó không có tên thuộc tính (ObjectId)
        Chat.find({ users: { $elemMatch: { $eq: curUser._id } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 }) //lấy phần tử mới nhất
            .then(async (results) => {
                //thông tin người gửi mess cuối cùng
                results = await User.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'name picture email',
                });
                res.status(200).send(results);
            })
            .catch((error) => {
                next(error);
            });
    },
    async createGroupChat(req, res, next) {
        try {
            const creatorChat = req.user; //người tạo group là myself <=> creatorChat
            const { users, nameGroup } = req.body;
            console.log('Create Group Chat'.blue, { users, nameGroup });
            users.push(creatorChat);

            if (!users || !nameGroup)
                return next(CreateError.BadRequest('Please Fill all the fields'));

            if (users.length < 2)
                return next(
                    CreateError.BadRequest('More than 2 users are required to form a group chat'),
                );

            const groupChat = await Chat.create({
                chatName: nameGroup,
                users,
                isGroupChat: true,
                groupAdmin: creatorChat,
            });

            const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
                .populate('users', '-password')
                .populate('groupAdmin', '-password');

            return res.status(200).json(fullGroupChat);
            //
        } catch (error) {
            next(error);
        }
    },
    async renameGroup(req, res, next) {
        try {
            const curUser = req.user;
            const { chatId, chatName } = req.body;
            const chat = await Chat.findOne({ _id: chatId }).select('groupAdmin');

            if (!curUser._id.equals(chat.groupAdmin)) {
                return next(CreateError.Unauthorized('Permission Denied'));
            }

            const updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                { chatName },
                { new: true }, //trả về ob sau update
            )
                .populate('users', '-password')
                .populate('groupAdmin', '-password');

            return updatedChat
                ? res.json(updatedChat)
                : next(CreateError.NotFound('Chat not found'));
            //
        } catch (error) {
            next(error);
        }
    },
    async addToGroup(req, res, next) {
        const { chatId, userId } = req.body;
        const curUser = req.user;
        const chat = await Chat.findOne({ _id: chatId }).select('groupAdmin');

        if (!curUser._id.equals(chat.groupAdmin)) {
            return next(CreateError.Unauthorized('Permission Denied'));
        }

        const added = await Chat.findByIdAndUpdate(
            chatId,
            { $addToSet: { users: userId } },
            { new: true },
        )
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        return added ? res.json(added) : next(CreateError.NotFound('Chat not found'));
    },
    async removeFromGroup(req, res, next) {
        const { chatId, userId } = req.body;
        const curUser = req.user;
        const chat = await Chat.findOne({ _id: chatId }).select('groupAdmin');

        if (!curUser._id.equals(chat.groupAdmin)) {
            return next(CreateError.Unauthorized('Permission Denied'));
        }

        const removed = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },
            { new: true },
        )
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        return removed ? res.json(removed) : next(CreateError.NotFound('Chat not found'));
    },
    //search
    async fetchAllUsers(req, res) {
        console.log('fetchAllUsers'.green, { user: req.user, keyword: req.query.keyword });
        const userCurrent = req.user;
        const keyword = req.query.keyword
            ? {
                  $and: [
                      { name: { $regex: req.query.keyword, $options: 'i' } },
                      { _id: { $ne: userCurrent._id } },
                  ],
              }
            : { _id: { $ne: userCurrent._id } };

        const users = await User.find(keyword);
        res.send(users);
    },
};

/*
    $and để kết hợp các điều kiện trong một mảng.
    $elemMatch để tìm các cuộc trò chuyện có người dùng chứa req.user._id (ID của người dùng hiện tại đang thực hiện yêu cầu).
    $eq được sử dụng để so sánh giá trị của một trường với một giá trị cụ thể.

    User.populate() được sử dụng để kết hợp thông tin từ bộ sưu tập "users" vào kết quả truy vấn.
Đối số đầu tiên (isChat) là đối tượng kết quả truy vấn mà chúng ta muốn kết hợp thông tin vào.

Đối số thứ hai là một đối tượng truyền vào để chỉ định trường và các tùy chọn kết hợp (populate). Trong trường hợp này:

path: 'latestMessage.sender' chỉ định trường "latestMessage.sender" là trường chúng ta muốn kết hợp.

select: 'name pic email' chỉ định các trường "name", "pic", và "email" của người gửi tin nhắn mà chúng ta muốn trả về trong kết quả truy vấn.
    */
