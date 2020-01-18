const config = require('./config.json'); // eslint-disable-line
const HhAdapter = require('./src/adapters/hh');
const MoikrugAdapter = require('./src/adapters/moikrug');
const { TelegramAPI } = require('./src/bot');
const { LoadJobPageDOM } = require('./src/jobLoader');

const api = new TelegramAPI(config);

const url = process.argv[2];

async function publishByLink(link, adapter) {
    const document = await LoadJobPageDOM(link);
    const vacancyText = adapter.parseItem({ link, document });
    await api.postVacancy(vacancyText, link);
}

if (url.includes('career.habr.com')) {
    publishByLink(url, MoikrugAdapter);
} else if (url.includes('hh')) {
    publishByLink(url, HhAdapter);
}
