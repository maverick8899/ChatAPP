const md5 = require('md5');

module.exports = {
    generateSign: (params) => {
        //nonce và timestamp được xác minh ở phần trước
        const keyToken = process.env.KEY_PUBLIC;
        const sortKeys = [];

        params.v = 'v1'; // đổi version thì api cũng không hợp lệ
        params.keyToken = keyToken;

        for (const key in params) {
            //{userData: 'xxx',sign:'xxxx'}
            key !== 'sign' && sortKeys.push(`${key}:${params[key]}`); //[sign:'xxxx']
        }
        let paramsHolder = sortKeys.sort().join(''); //userDataxxxs

        //dùng giá trị này so sánh với sign client gửi lên
        return `${md5(paramsHolder)}`;
    },
};
