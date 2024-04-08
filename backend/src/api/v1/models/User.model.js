const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { connectChatAPP } = require('../../../configs/connections_mongDB');

const UserSchema = new Schema({
    name: { type: 'string', required: false },
    email: { type: String, lowercase: true, unique: true, require: true },
    password: { type: String, require: true },
    picture: {
        type: 'String',
        default:
            'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' },
    // Trạng thái đăng ký
    registrationStatus: {
        type: String,
        enum: ['pending', 'completed'], // Giá trị có thể là 'pending' hoặc 'completed'
        default: 'pending', // Trạng thái mặc định là 'pending'
    },
});
//? Các giá trị 1 ở đây đại diện cho thứ tự sắp xếp tăng dần của các giá trị trong index.
//? registrationStatus: 'pending' sẽ được xóa sau expireAfterSeconds
UserSchema.index(
    { registrationStatus: 1, createdAt: 1 },
    { expireAfterSeconds: 300, partialFilterExpression: { registrationStatus: 'pending' } },
);

//encode before save
UserSchema.pre('save', async function (next) {
    try {
        const hashPassword = await bcrypt.hash(this.password, 10);
        this.password = hashPassword;
        next(); //next là hàm async
        console.log(`Save user ::: ${this.email} ${this.password}`.green);
    } catch (error) {
        next(error);
    }
});

//thêm method cho documents
//truyền password từ body(POST) và this.password từ user tìm thấy từ query
//tiến hành băm password và so sánh với password đã băm trong DB
UserSchema.methods.isCheckPassword = async function (password) {
    //encrypted =decoded
    return await bcrypt.compare(password, this.password); // true false
};

module.exports = connectChatAPP.model('User', UserSchema);
//instance allow connect multi store, nếu không dùng đối tượng connections
//module.exports = mongoose.model("user", UserSchema);
