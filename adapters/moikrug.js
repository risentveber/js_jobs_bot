const request = require('superagent');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { getTags } = require('../lib/tagger');
const { getJobType } = require('../lib/jobType');
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
                const salaryElem =  dom.window.document.querySelector(".footer_meta .salary");
                const salary = salaryElem ? salaryElem.textContent : 'Не указана.';
                const locationElem =  dom.window.document.querySelector(".footer_meta .location");
                const locationWords = (locationElem && locationElem.textContent || '').split(', ');

                const title =  dom.window.document.querySelector(".company_name").textContent;
                const titleFooter =  dom.window.document.querySelector(".footer_meta").textContent;
                const pureContent = element.textContent;

                resolve(render({
                    tags: getTags(pureContent),
                    salary: `ЗП: ${salary}`,
                    location: locationWords[locationWords.length - 1],
                    title,
                    link: item.link,
                    description: element.innerHTML,
                    jobType: getJobType(titleFooter),
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