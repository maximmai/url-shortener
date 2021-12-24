const redis = require('redis');

const RedisClient = (function() {
    return redis.createClient({
        host: '192.168.2.231',
        port: 6379,
        password: 'new2you!'
    });

})();

module.exports = RedisClient