const R = require('ramda');

const { getTags, getJobType } = require('../tagger');
const { render } = require('../render');

function parseItem({ link, document }) {
    const element = document.querySelector('.job_show_description__body');
    const salaryElem = document.querySelector('.footer_meta .salary');
    const salary = salaryElem ? salaryElem.textContent : 'Не указана.';
    const locationElem = document.querySelector('.footer_meta .location');
    const locationWords = R.pathOr('', ['textContent'], locationElem).split(', ');

    const company = document.querySelector('.company_name').textContent;
    const title = document.querySelector('h1').textContent;
    const titleFooter = document.querySelector('meta[name=description]').textContent;
    const pureContent = element.textContent;

    return render({
        tags: getTags(pureContent),
        salary: `ЗП: ${salary}`,
        location: locationWords[locationWords.length - 1],
        company,
        title,
        link,
        description: element.innerHTML,
        jobType: getJobType(titleFooter),
        important: Array.from(element.querySelectorAll('strong')).map(e => e.textContent),
    });
}

function getKey(item) {
    return item.link;
}

module.exports = {
    getKey,
    parseItem,
};
