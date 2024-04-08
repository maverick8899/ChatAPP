const Joi = require('joi');

const userValidate = (data) => {
    //Định nghĩa dữ liệu đưa vào
    const userSchema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email()
        .pattern(new RegExp('gmail.com|ou.edu.vn'))
        .lowercase().required(),
        password: Joi.string().min(6).max(30).required(),
        picture: Joi.string().uri().allow(null),
        role: Joi.string().allow('user', 'manager', 'admin').default('user'),
    });
    //validate
    return userSchema.validate(data);
};

module.exports = { userValidate };

//valid: trả về object <=> { value: { email: 'lu12345@gmail.com', password: '123456' } }
//invalid
// {
//   value: { email: 'lu12345@gmail.coms', password: '123456' },
//   error: [Error [ValidationError]: "email" must be a valid email] {
//     _original: { email: 'lu12345@gmail.coms', password: '123456' },
//     details: [ [Object] ]...
//   }
// }
