const Az = require('az');
const request = require('superagent');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const htmlToText = require('html-to-text');

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


function parseItem(item) {

    return new Promise((resolve, reject) => {
        request
            .get(item.link)
            .end(function(err, res) {
                if(err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                const dom = new JSDOM(res.text);
                const element = dom.window.document.querySelector(".vacancy_description");
                const salary =  dom.window.document.querySelector(".salary").textContent;
                const location =  dom.window.document.querySelector(".location").textContent;
                const pureContent = element.textContent;
                const formattedContent = htmlToText.fromString(element.innerHTML);
                const tokens = Az.Tokens(pureContent).done();
                const tags = tokens.filter(t => t.subType && t.subType.toString() === 'LATIN' && t.type.toString() === 'WORD')
                    .map(t => '#' + t.toString().replace('-', '_')).filter(onlyUnique);
                if (tags.length <= 35) {
                    resolve(`#${location}\n${salary}\n${tags.join(' ')}\n<pre>${formattedContent}</pre>\n${item.link}`);
                } else {
                    resolve(`#${location}\n${salary}\n<pre>${formattedContent}</pre>\n${item.link}`);
                }
            });
    });
}

function getKey(item) {
    return item.link;
}

function isValid(item) {
    return true
}

module.exports = {
    getKey,
    isValid,
    parseItem
};