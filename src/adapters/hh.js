const { getTags, getJobType } = require('../tagger');
const { render } = require('../render');

function parseItem({ link, document }) {
    const [, salaryRaw, location] = document.querySelector('meta[name=description]').content.split('. ');
    const salary = `ЗП: ${salaryRaw.split(': ')[1] || salaryRaw}`;

    const element = document.querySelector('.b-vacancy-desc-wrapper, .vacancy-description, .b-vp-content, .tmpl_hh-content, [data-qa=\'vacancy-branded\']');
    const company = document.querySelector('.companyname, .vacancy-company-name').textContent;
    if (!element) {
        console.log('error link', link);
    }
    const title = document.querySelector('[data-qa=vacancy-title]').textContent;
    const pureContent = element.textContent;
    const skills = document.querySelectorAll('[data-qa*=skills-element]');
    const skillsText = Array.from(skills).map(e => e.textContent).join(' ');
    const tags = getTags(`${pureContent} ${skillsText}`);

    Array.from(element.querySelectorAll('.vacancy-section'))
        .forEach((section) => {
            if (section.querySelector('[data-qa*=skills-element]')) {
                section.parentNode.removeChild(section);
            }
        });

    const tel = document.querySelector('a[href*=tel]');
    if (tel) {
        tel.parentNode.removeChild(tel);
    }

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
