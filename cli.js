const bot = require('./src/bot');
const HhAdapter = require('./src/adapters/hh');
const MoikrugAdapter = require('./src/adapters/moikrug');

const link = process.argv[2];
let adapter;
if (link.includes('career.habr.com')) {
    adapter = MoikrugAdapter;
} else if (link.includes('hh')) {
    adapter = HhAdapter;
}
adapter.parseItem({ link }).then(data => bot.postVacancy(data, link));
