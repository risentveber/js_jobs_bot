const remoteKeywords = [
    'удаленка',
    'удаленно',
    'удаленная',
    'можно удаленно',
    'remote',
    'remotely',
];

function getJobType(pureContent) {
    const lowered = pureContent.toLowerCase();
    return remoteKeywords.some(keyword => lowered.includes(keyword)) ? 'удаленка' : 'офис';
}

module.exports = {
    getJobType,
};
