const {parse, URL} = require("url");
const shortid = require('shortid');

const validateHash = (id) => {
    return shortid.isValid(id);
};

/**
 *
 * @param url
 * @returns {number}
 */
const hash = (url) => {
    const hashed = shortid.generate();
    return hashed;
}

/**
 *
 * @param url
 * @param protocols
 * @returns {*|boolean|boolean}
 */
const sanitize = (url, protocols) => {
    try {
        new URL(url);
        const parsed = parse(url);
        return protocols
            ? parsed.protocol
                ? protocols.map(x => `${x.toLowerCase()}:`).includes(parsed.protocol)
                : false
            : true;
    } catch (err) {
        return false;
    }
}

// rateLimiter.js
const tokenBuckets = {};
// import { createClient } from 'redis';
// const client = createClient();

function rateLimiter({ tokensPerInterval, interval, bucketSize }) {
    return (req, res, next) => {

        // step 1: get the key
        const key = req.ip; // Or req.user.id for authenticated users
        const now = Date.now();
        console.log(key, now, tokenBuckets);

        // step 2: get the corresponding "bucket" by key, or initialize one
        let bucket = tokenBuckets.key;
        if (!bucket) {
            bucket = {
                tokens: bucketSize,
                lastRefill: now
            };
            tokenBuckets.key = bucket;
        }

        // step 3: Refill tokens. tokens = (time since last filled) / interval * token per interval
        const elapsed = now - bucket.lastRefill;
        const tokensToAdd = Math.floor(elapsed / interval) * tokensPerInterval;
        if (tokensToAdd > 0) {
            bucket.tokens = Math.min(bucket.tokens + tokensToAdd, bucketSize);
            bucket.lastRefill = now;
        }

        // Check if a token is available
        if (bucket.tokens > 0) {
            bucket.tokens -= 1;
            next(); // Allow the request
        } else {
            res.status(429).json({ error: 'Too Many Requests' });
        }
    };
}


module.exports = {
    validateHash,
    hash,
    sanitize,
    rateLimiter
}