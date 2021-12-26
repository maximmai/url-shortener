const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const RedisClient = require('./redis');
const {hash, sanitize} = require('./lib');

const BASE_URL = process.env.BASE_URL;
const SUPPORTED_PROTOCOLS = ["https", "http"];

const main = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const port = 3000;

    app.get('/:hashed', async (req, res) => {
        const result = await RedisClient.get(req.params.hashed);
        const response = result ? result : null;
        const sanitized = sanitize(response, SUPPORTED_PROTOCOLS);
        if (sanitized) {
            res.redirect(response);
        } else {
            res.status(404).send(null);
        }

    });

    app.post('/url/shorten', (req, res) => {
        const originalUrl = req.body.url;
        const hashed = hash(originalUrl);
        const sanitized = sanitize(originalUrl, SUPPORTED_PROTOCOLS);
        if (sanitized) {
            RedisClient.set(hashed, originalUrl);
            res.send({
                url: `${BASE_URL}/${hashed}`,
            });
        } else{
            res.status(400).send(null);
        }

    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
};

(async () => {
    try {
        await main();
    } catch (e) {
        // Deal with the fact the chain failed
        console.error(e);
    }
})();