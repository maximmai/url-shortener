const Redis = require("ioredis");
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;
const hosts = process.env.REDIS_HOSTS.split(",");

const configs = hosts.map(host => {
    return {
        username: 'default',
        password: password,
        port: port,
        host: host,
    }
});

const RedisClient = new Redis.Cluster(configs);

module.exports = RedisClient