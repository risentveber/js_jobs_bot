function parseItem(item) {
    const splited = item.content.split(/\n<p>|<\/p><p>|<\/p>\n/).filter(i => i);
    const [
        name,
        date,
        region,
        salary
    ] = splited;

    return `#${region.split(': ')[1].replace('-', '_')}
<pre>
${name.split(': ')[1]}
${date.split(': ')[1]}
Уровень ЗП: ${salary.split(': ')[1]}
</pre>
${item.link}`;
}

function getKey(item) {
    return item.link;
}

function isValid(item) {
    return true
}

module.exports = {
    getKey,
    isValid,
    parseItem
};