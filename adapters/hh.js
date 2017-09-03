const Az = require('az');
const request = require('superagent');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const htmlToText = require('html-to-text');

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function parseItem(item) {
    const splited = item.content.split(/\n<p>|<\/p><p>|<\/p>\n/).filter(i => i);
    const [
        name,
        date,
        region,
        salary
    ] = splited;

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
                const element = dom.window.document.querySelector(".b-vacancy-desc-wrapper");
                const pureContent = element.textContent;
                const formattedContent = htmlToText.fromString(element.innerHTML);
                const tokens = Az.Tokens(pureContent).done();
                const tags = tokens.filter(t => t.subType && t.subType.toString() === 'LATIN' && t.type.toString() === 'WORD')
                    .map(t => '#' + t.toString().replace('-', '_')).filter(onlyUnique);
                if (tags.length <= 35) {
                    resolve(`
#${region.split(': ')[1].replace('-', '_')}\n${salary}\n${tags.join(' ')}
<pre>${formattedContent}</pre>
${item.link}`
);
                } else {
                    resolve(`
#${region.split(': ')[1].replace('-', '_')}\n#${salary}
<pre>${formattedContent}</pre>
\n${item.link}`);
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