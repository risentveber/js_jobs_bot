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
                    reject(new Error(err.toString() + item.link));
                    return;
                }

                const { document } = (new JSDOM(res.text)).window;
                const element = document.querySelector('.vacancy_description');
                const salaryElem = document.querySelector('.footer_meta .salary');
                const salary = salaryElem ? salaryElem.textContent : 'Не указана.';
                const locationElem = document.querySelector('.footer_meta .location');
                const locationWords = R.pathOr('', ['textContent'], locationElem).split(', ');

                const company = document.querySelector('.company_name').textContent;
                const title = document.querySelector('h1.title').textContent;
                const titleFooter = document.querySelector('.footer_meta').textContent;
                const pureContent = element.textContent;

                resolve(render({
                    tags: getTags(pureContent),
                    salary: `ЗП: ${salary}`,
                    location: locationWords[locationWords.length - 1],
                    company,
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


module.exports = {
    getKey,
    parseItem,
};
