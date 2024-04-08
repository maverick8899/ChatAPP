const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const { connectChatAPP } = require('../../../configs/connections_mongDB');

//* "Date.now()"  Điều này dẫn đến việc mỗi khi một đối tượng OTP mới được tạo, trường time sẽ được đặt là thời điểm tạo schema và không được cập nhật lại sau đó.=> " () => Date.now() "
const OTPSchema = new Schema(
    {
        email: { type: 'string' },
        otp: { type: 'string' },
        time: { type: Date, default: () => Date.now(), index: { expires: '60s' } },
    },
    { timestamps: true },
);

OTPSchema.pre('save', async function (next) {
    try {
        console.log('OTP is stored: '.gray, this.otp);
        const hashOTP = await bcrypt.hash(this.otp, 10);
        this.otp = hashOTP;
        next();
    } catch (error) {
        next(error);
    }
});

OTPSchema.methods.isCheckOTP = async function (otp) {
    //encrypted =decoded
    const r = await bcrypt.compare(otp, this.otp);
    console.log('OTPSchema.methods.isCheckOTP '.blue, r);
    return r; // true false
};

module.exports = connectChatAPP.model('otp', OTPSchema);
