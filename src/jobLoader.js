const request = require('superagent');
const randomUseragent = require('random-useragent');
const { JSDOM } = require('jsdom');

const { LoadJobError } = require('./errors');

async function LoadJobPageDOM(link) {
    let htmlText;
    try {
        const res = await request
            .get(link)
            .set('User-Agent', randomUseragent.getRandom())
            .redirects(10)
            .then();
        htmlText = res.text;
    } catch (err) {
        throw new LoadJobError(err, link);
    }

    const { document } = (new JSDOM(htmlText)).window;
    return document;
}

module.exports = {
    LoadJobPageDOM,
};
