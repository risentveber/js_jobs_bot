const htmlToText = require('html-to-text');
const whiteSpaceRegex = /^\s*$/;

function render({ title, location, salary, tags, description, link, important = [], jobType='' }) {
    let formattedDescription = htmlToText
        .fromString(description, {
            wordwrap: null,
            noLinkBrackets: true,
            hideLinkHrefIfSameAsText: true,
            format: {
                unorderedList: function formatUnorderedList(elem, fn, options) {
                    let result = '';
                    const nonWhiteSpaceChildren = (elem.children || []).filter(function(child) {
                        return child.type !== 'text' || !whiteSpaceRegex.test(child.data);
                    });
                    nonWhiteSpaceChildren.forEach(function(elem) {
                        result += ' <b>●</b> ' + fn(elem.children, options) + '\n';
                    });
                    return '\n' + result + '\n';
                }
            }
        })
        .replace(/\n\s*\n/g, '\n');

    important.filter(text => text.includes(':')).forEach(text => {
        try {
          formattedDescription = formattedDescription.replace(new RegExp(text, 'g'), `<b>${text}</b>`)
        } catch (e) {
          console.log(text, e)
        }
    });

    const formattedTags = tags.map(t => '#' + t).join(' ');
    const locationFormatted = location ? `#${location.replace(/ |-/g, '_')} `: '';

    return `<b>${title.replace(/\n\s*\n/g, '')}</b><a href="https://habrastorage.org/getpro/moikrug/uploads/company/100/005/877/4/logo/medium_93b16bcf61b491510f0c44806c5f3f79.png">&#8205;</a>\n${locationFormatted}#${jobType}\n<b>${salary}</b>\n${formattedTags}\n${formattedDescription}\n${link}`;
}

module.exports = {
    render
};