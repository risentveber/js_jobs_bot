const request = require('superagent');
const { JSDOM } = require('jsdom');

const { getTags } = require('../lib/tagger');
const { getJobType } = require('../lib/jobType');
const { render } = require('../lib/render');

function parseItem({ link, content = '' }) {
    const splited = content.split(/\n<p>|<\/p><p>|<\/p>\n/).filter(i => i);
    const [, ,

        region,
        salaryData,
    ] = splited;
    return new Promise((resolve, reject) => {
        request.agent()
            .get(link)
            .redirects(10)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                const { document } = (new JSDOM(res.text)).window;

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
                const title = document.querySelector('.companyname, .vacancy-company-name').textContent;
                if (!element) { console.log('error link', link); }
                const pureContent = element.textContent;
                const skills = document.querySelectorAll('[data-qa=skills-element]');
                const tags = getTags(`${pureContent} ${Array.from(skills).map(e => e.textContent).join(' ')}`);

                Array.from(element.querySelectorAll('.vacancy-section')).forEach((e) => {
                    if (e.querySelector('[data-qa=skills-element]')) {
                        e.parentNode.removeChild(e);
                    }
                });

                resolve(render({
                    title,
                    location,
                    salary,
                    tags,
                    description: element.innerHTML,
                    link,
                    jobType: getJobType(pureContent),
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
