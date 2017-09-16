const htmlToText = require('html-to-text');
const whiteSpaceRegex = /^\s*$/;

function render({ title, location, salary, tags, description, link, important = [], jobType='' }) {
    console.log(important)
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
        formattedDescription = formattedDescription.replace(new RegExp(text, 'g'), `<b>${text}</b>`)
    });

    const formattedTags = tags.map(t => '#' + t).join(' ');
    const locationFormatted = location ? `#${location.replace(/ |-/g, '_')} `: '';

    return `<b>${title}</b>\n${locationFormatted}#${jobType}\n<b>${salary}</b>\n${formattedTags}\n${formattedDescription}\n${link}`;
}

module.exports = {
    render
};