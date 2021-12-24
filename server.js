const express = require('express');
const redisClient = require('./redis');

const main = async () => {
    const app = express();
    const port = 3000;

    app.get('/:hashed', (req, res) => {
        res.send(redisClient.get(req.params.hashed));
    });

    app.post('/url/shorten', (req, res) => {
        const hashed = + new Date();
        res.send(redisClient.set(req.params.hashed, req.body.url));
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
    }
})();