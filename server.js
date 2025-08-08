const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const DBClient = require('./db');
const {hash, sanitize, validateHash, rateLimiter} = require('./lib');

const APP_PORT = process.env.APP_PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SUPPORTED_PROTOCOLS = ["https", "http"];

const main = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(rateLimiter({
        tokensPerInterval: 1,
        interval: 2000,
        bucketSize: 5
    }));

    app.get('/:hashed', async (req, res) => {
        if (!validateHash(req.params.hashed)) {
            return res.status(404).send("invalid key");
        }
        const result = await DBClient.get(req.params.hashed);
        const response = result ? result : null;
        const sanitized = sanitize(response, SUPPORTED_PROTOCOLS);
        if (sanitized) {
            res.redirect(response);
        } else {
            res.status(404).send(null);
        }
    });

    app.post('/url/shorten', async (req, res) => {
        const originalUrl = req.body.url;
        const hashed = hash(originalUrl);
        const sanitized = sanitize(originalUrl, SUPPORTED_PROTOCOLS);
        if (sanitized) {
            await DBClient.set(hashed, originalUrl);
            res.send({
                url: `${BASE_URL}/${hashed}`,
            });
        } else {
            res.status(400).send(null);
        }
    });

    app.get('/test/ping', (req, res) => {
        res.send('Request accepted!');
    });

    app.listen(APP_PORT, () => {
        console.log(`url-shortener app listening at http://localhost:${APP_PORT}`)
    });
};

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e);
    }
})();