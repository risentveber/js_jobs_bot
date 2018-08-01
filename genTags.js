const fs = require('fs');

const { getTags } = require('./lib/tagger');

const stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
console.log(getTags(stdinBuffer.toString()).map(e => `#${e}`).join(' '));
