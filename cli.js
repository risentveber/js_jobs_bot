const bot = require('./bot');
const HhAdapter = require('./adapters/hh');
const MoikrugAdapter = require('./adapters/moikrug');

const link = process.argv[2];
let adapter;
if (link.includes('career.habr.com')) {
    adapter = MoikrugAdapter;
} else if (link.includes('hh')) {
    adapter = HhAdapter;
}
adapter.parseItem({ link }).then(data => bot.postVacancy(data, link));
