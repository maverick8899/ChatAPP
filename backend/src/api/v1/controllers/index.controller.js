const JWT = require('../services/JWT.service');
//
const setAccessTokenCookie = (res, accessToken) => {
    const MAX_ACCESS_TOKEN_AGE = 30_000; //30s

    res.cookie('accessToken', accessToken, {
        signed: true,
        domain: 'localhost',
        sameSite: 'Strict',
        httpOnly: true,
        maxAge: MAX_ACCESS_TOKEN_AGE,
    });
};
module.exports = {
    checkLogin: async (req, res, next) => {
        const refreshToken = req.signedCookies.refreshToken;
        const accessToken = req.signedCookies.accessToken;
        //nếu không có refreshToken chuyển đến login để tạo tokens
        if (!refreshToken) {
            return next();
        }
        try {
            if (accessToken) {
                //check accessToken nếu còn hạn thì chuyển đến home
                const decode = JWT.verifyAccessToken(accessToken);
                if (decode) {
                    return res.redirect('/user/home');
                }
            }
            //nếu không có accessToken nhưng refreshToken vẫn còn thì làm mới accessToken
            else {
                const { userId } = await JWT.verifyRefreshToken(refreshToken);
                const newAccessToken = await JWT.signAccessToken(userId);
                console.log('indexRoute.refreshToken:', newAccessToken);

                setAccessTokenCookie(res, newAccessToken);

                res.redirect('/user/home');
            }
        } catch (error) {
            //if accessToken or refreshToken invalid
            return next();
        }
    },
    pageLogin: (req, res) => {
        return res.render('index');
    },
};
