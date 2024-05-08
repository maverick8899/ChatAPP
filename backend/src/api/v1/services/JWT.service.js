const JWT = require('jsonwebtoken');
const CreateError = require('http-errors');

const redisClient = require('../../../configs/connections_redis');

EXP_RT = '1d';
EXP_AT = '2h';
module.exports = {
    signAccessToken: async (userId) => {
        const options = {
            expiresIn: EXP_AT, //* 10m 10s 10d ...
        };
        return new Promise((resolve, reject) => {
            JWT.sign({ userId }, process.env.ACCESS_TOKEN, options, (err, token) => {
                err && reject(err);
                resolve(token);
            });
        });
    },

    verifyAccessToken: (token) => {
        //* decode Access_Token by verify Func
        try {
            const decode = JWT.verify(token, process.env.ACCESS_TOKEN);
            console.log('jwt_service.verifyAccessToken.decode', decode);
            return decode;
        } catch (err) {
            // catch error expired
            if (err.name === 'TokenExpiredError') {
                throw { code: 401, message: err.message }; //? 401 Unauthorized
            } else {
                throw { code: 500, message: err.message };
            }
        }
    },

    signRefreshToken: async (userId) => {
        return new Promise((resolve, reject) => {
            JWT.sign(
                { userId },
                process.env.REFRESH_TOKEN,
                {
                    expiresIn: EXP_RT, //* 10s 10m 10h 10d...
                },
                (err, token) => {
                    err && reject(err);

                    //? set refreshToken into Redis, reply return Ok if not err
                    redisClient.set(
                        JSON.stringify({ userId: `${userId}` }),
                        JSON.stringify({ refreshToken: token }),
                        'EX', //* also: NX, PX, EXAT, PXAT
                        365 * 24 * 60 * 60,
                        (err, reply) => {
                            if (err) {
                                reject(CreateError.InternalServerError());
                            }
                            resolve(token);
                        },
                    );
                },
            );
        });
    },

    //* receive refreshToken before (generated from api login)
    //? compare refreshToken from client to server, if valid go ahead else throw exception
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decode) => {
                err && reject(err);

                console.log('decode.userId', decode.userId);
                //* get dữ liệu từ redis
                redisClient.get(JSON.stringify({ userId: `${decode.userId}` }), (err, reply) => {
                    const refreshToken_Redis = JSON.parse(reply).refreshToken;
                    //* reply return value compatible with userId in Redis
                    console.log('jwt_service.verifyRefreshToken', {
                        refreshToken_Login: refreshToken,
                        refreshToken_Redis,
                    });

                    //* check err
                    err && reject(CreateError.InternalServerError());

                    //* kiểm tra RF truyền vào phải bằng với RF được tạo ra ở API login thì mới trả về decode
                    return refreshToken === refreshToken_Redis
                        ? resolve(decode)
                        : reject(CreateError.Unauthorized('refreshToken is due or invalid'));
                });
            });
        });
    },
};
