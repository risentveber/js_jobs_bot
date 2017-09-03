function parseItem(item) {
    return `${item.content}\n${item.link}`;
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