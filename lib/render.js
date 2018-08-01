const htmlToText = require('html-to-text');
const truncate = require('truncate-html');

const whiteSpaceRegex = /^\s*$/;

function render({
    title, location, salary, tags, description, link, important = [], jobType = '',
}) {
    let formattedDescription = htmlToText
        .fromString(truncate(description, 3000), {
            wordwrap: null,
            noLinkBrackets: true,
            ignoreImage: true,
            hideLinkHrefIfSameAsText: true,
            format: {
                unorderedList: function formatUnorderedList(elem, fn, options) {
                    let result = '';
                    const nonWhiteSpaceChildren = (elem.children || []).filter(child => child.type !== 'text' || !whiteSpaceRegex.test(child.data));
                    nonWhiteSpaceChildren.forEach((childElem) => {
                        result += ` <b>•</b> ${fn(childElem.children, options)}\n`;
                    });
                    return `\n${result}\n`;
                },
            },
        });

    important.filter(text => text.includes(':') && text.length > 2).forEach((text) => {
        try {
            formattedDescription = formattedDescription.replace(new RegExp(text, 'g'), `<b>${text}</b>`);
        } catch (e) {
            console.log(text, e);
        }
    });

    formattedDescription = formattedDescription.replace('Показать на карте', '');
    formattedDescription = formattedDescription.replace(/КЛЮЧЕВЫЕ НАВЫКИ[^+]*КОНТАКТНАЯ ИНФОРМАЦИЯ/m, '<b>Контакты:</b>');
    formattedDescription = formattedDescription.replace(/АДРЕС/, '\n<b>Адрес:</b>\n');
    formattedDescription = formattedDescription.replace(/\n\s*\n/g, '\n');

    const formattedTags = tags.map(t => `#${t}`).join(' ');
    const locationFormatted = location ? `#${location.replace(/ |-/g, '_')} ` : '';

    return `<b>${title.replace(/\n\s*\n/g, '')}</b>\n${locationFormatted}#${jobType}\n<b>${salary}</b>\n${formattedTags}\n${formattedDescription}`;
}

module.exports = {
    render,
};
