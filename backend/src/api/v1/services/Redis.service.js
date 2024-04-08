const client = require('../../../configs/connections_redis');

module.exports = {
    increment(key) {
        return new Promise((resolve, reject) => {
            client.incr(key, (err, result) => {
                err && reject(err);
                resolve(result);
            });
        });
    },
    setTTL(key, TTL) {
        return new Promise((resolve, reject) => {
            client.expire(key, TTL, (err, result) => {
                err && reject(err);
                resolve(result);
            });
        });
    },
    getTTL(key) {
        return new Promise((resolve, reject) => {
            client.ttl(key, (err, result) => {
                err && reject(err);
                resolve(result);
            });
        });
    },
};
