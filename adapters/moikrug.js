const request = require('superagent');
const { JSDOM } = require('jsdom');
const R = require('ramda');

const { getTags } = require('../lib/tagger');
const { getJobType } = require('../lib/jobType');
const { render } = require('../lib/render');

function parseItem(item) {
    return new Promise((resolve, reject) => {
        request
            .get(item.link)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                const { document } = (new JSDOM(res.text)).window;
                const element = document.querySelector('.vacancy_description');
                const salaryElem = document.querySelector('.footer_meta .salary');
                const salary = salaryElem ? salaryElem.textContent : 'Не указана.';
                const locationElem = document.querySelector('.footer_meta .location');
                const locationWords = R.propOr('', 'textContent', locationElem).split(', ');

                const title = document.querySelector('.company_name').textContent;
                const titleFooter = document.querySelector('.footer_meta').textContent;
                const pureContent = element.textContent;

                resolve(render({
                    tags: getTags(pureContent),
                    salary: `ЗП: ${salary}`,
                    location: locationWords[locationWords.length - 1],
                    title,
                    link: item.link,
                    description: element.innerHTML,
                    jobType: getJobType(titleFooter),
                    important: Array.from(element.querySelectorAll('strong')).map(e => e.textContent),
                }));
            });
    });
}

function getKey(item) {
    return item.link;
}

function isValid() {
    return true;
}

module.exports = {
    getKey,
    isValid,
    parseItem,
};
