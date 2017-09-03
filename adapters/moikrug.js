const request = require('superagent');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { getTags } = require('../lib/tagger');
const { render } = require('../lib/render');

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
                const title =  dom.window.document.querySelector(".company_name").textContent;
                const pureContent = element.textContent;

                resolve(render({
                    tags: getTags(pureContent),
                    salary: `ЗП: ${salary}`,
                    location,
                    title,
                    link: item.link,
                    description: element.innerHTML
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