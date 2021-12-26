const {parse, URL} = require("url");
const shortid = require('shortid');

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

module.exports = {
    hash,
    sanitize
}