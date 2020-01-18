const { getTags, getJobType } = require('../tagger');
const { render } = require('../render');

function parseItem({ link, content = '', document }) {
    const splited = content.split(/\n<p>|<\/p><p>|<\/p>\n/).filter(i => i);
    const [, ,
        region,
        salaryData,
    ] = splited;

    let location;
    let salary;
    if (region && salaryData) {
        location = region.split(': ')[1] || region;
        salary = `ЗП: ${salaryData.split(': ')[1] || salaryData}`;
    } else {
        [, salary, location] = document.querySelector('meta[name=description]').content.split('. ');
        salary = `ЗП: ${salary.split(': ')[1] || salary}`;
    }

    const element = document.querySelector('.b-vacancy-desc-wrapper, .vacancy-description, .b-vp-content, .tmpl_hh-content, [data-qa=\'vacancy-branded\']');
    const company = document.querySelector('.companyname, .vacancy-company-name').textContent;
    if (!element) {
        console.log('error link', link);
    }
    const pureContent = element.textContent;
    const skills = document.querySelectorAll('[data-qa=skills-element]');
    const tags = getTags(`${pureContent} ${Array.from(skills).map(e => e.textContent).join(' ')}`);

    Array.from(element.querySelectorAll('.vacancy-section')).forEach((e) => {
        if (e.querySelector('[data-qa*=skills-element]')) {
            e.parentNode.removeChild(e);
        }
    });
    const title = document.querySelector('[data-qa=vacancy-title]').textContent;

    return render({
        title,
        company,
        location,
        salary,
        tags,
        description: element.innerHTML,
        link,
        jobType: getJobType(pureContent),
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
