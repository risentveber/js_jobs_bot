const Az = require('az');
const namesMap = require('../resources/tagNames.json');

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getTags(pureContent) {
    const tokens = Az.Tokens(pureContent).done();
    const tags = tokens.filter(t => t.type.toString() === 'WORD')
        .map(t => t.toString().toLowerCase().replace('-', '_'))
        .map(name => namesMap[name])
        .filter(t => t)
        .filter(onlyUnique);
    return tags;
}

module.exports = {
    getTags
};