const redisService = require('../services/Redis.service');

module.exports = function limitRequest(num) {
    return async (req, res, next) => {
        try {
            let _ttl;
            const IP =
                req.header['x-forwarded-for'] || '192.168.10.31' || req.connection.remoteAddress;
            const numRequest = await redisService.increment(IP); //? increment: IP: number, return number
            console.log('IP'.red, req.header['x-forwarded-for'], req.connection.remoteAddress);

            if (numRequest === 1) {
                await redisService.setTTL(IP, 60);
                _ttl = 60; //? gán để log TTL
            } else {
                _ttl = await redisService.getTTL(IP);
            }
            //* Khi amount req in 1p > num then break middleware
            if (numRequest > num) {
                return res.status(503).json({
                    status: 'error',
                    TTL: _ttl,
                    message: 'server is busy',
                    numRequest,
                });
            }
            console.log('Log rate-limit'.blue, {
                status: 'success',
                numRequest,
                elements: 'data....',
                IP,
                TTL: _ttl,
            });
            next();
        } catch (error) {
            next(error);
        }
    };
};
