const htmlToText = require('html-to-text');

function render({ title, location, salary, tags, description, link }) {
    const formattedDescription = htmlToText
        .fromString(description, {hideLinkHrefIfSameAsText: true})
        .replace(/\n\s*\n/g, '\n');
    const formattedTags = tags.map(t => '#' + t).join(' ');

    return `<b>${title}</b>\n#${location.replace('-', '_')}\n<b>${salary}</b>\n${formattedTags}\n${formattedDescription}\n${link}`;
}

module.exports = {
    render
};