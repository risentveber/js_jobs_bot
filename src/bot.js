const Slimbot = require('slimbot');
const config = require('../config.json'); // eslint-disable-line

const bot = new Slimbot(config.TELEGRAM_API_KEY);

function logMessageToAdmin(message, type = 'Error') {
    bot.sendMessage(config.ADMIN_USER, `<b>${type}</b>\n<code>${message}</code>`, {
        parse_mode: 'HTML',
    });
}

async function postVacancy(message, link) {
    console.log('publish', link);
    const result = await bot.sendMessage(config.TARGET_CHANNEL, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        disable_notification: true,
        reply_markup: JSON.stringify({
            inline_keyboard: [[
                { text: 'Подробнее', url: `https://xn--90afahb2cse.xn--p1ai/redirect?to=${link}` },
            ]],
        }),
    });
    console.log('result', result);
    return result;
}

module.exports = {
    postVacancy,
    logMessageToAdmin,
};
