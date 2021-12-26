const express = require('express');
const RedisClient = require('./redis');
const { URL, parse } = require('url');

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

const main = async () => {
    const app = express();
    const port = 3000;

    app.get('/:hashed', async (req, res) => {
        const result = await RedisClient.get('abc');
        const response = result ? result : null;
        res.redirect(`https://google.ca?redirect=${response}`);
    });

    app.post('/url/shorten', (req, res) => {
        const hashed = + new Date();
        const originalUrl = req.body.url;
        const sanitized = sanitize(originalUrl, ["https", "http"]);
        if (sanitized) {
            res.send(RedisClient.set(hashed, originalUrl));
        } else{
            res.send(null);
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