const request = require('superagent');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { getTags } = require('../lib/tagger');
const { getJobType } = require('../lib/jobType');
const { render } = require('../lib/render');

function parseItem(item) {
    const splited = item.content.split(/\n<p>|<\/p><p>|<\/p>\n/).filter(i => i);
    const [
        title,
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
                const element = dom.window.document.querySelector('.b-vacancy-desc-wrapper') || dom.window.document.querySelector('.b-vp-content');
                const title = dom.window.document.querySelector('.companyname').textContent;
                if (!element) { console.log('error link', item.link)}
                const pureContent = element.textContent;
                const tags = getTags(pureContent);

                resolve(render({
                    title,
                    location: region.split(': ')[1] || region,
                    salary: `ЗП: ${salary.split(': ')[1] || salary}`,
                    tags,
                    description: element.innerHTML,
                    link: item.link,
                    jobType: getJobType(pureContent),
                    important: Array.from(element.querySelectorAll('strong')).map(e => e.textContent)
                }))
            });
    });
}

function getKey(item) {
    return item.link;
}

function isValid() {
    return true
}

module.exports = {
    getKey,
    isValid,
    parseItem
};