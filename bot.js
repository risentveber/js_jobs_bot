const Slimbot = require('slimbot');
const config = require('./config.json');

const bot = new Slimbot(config.TELEGRAM_API_KEY);

// bot.startPolling();

function logMessageToAdmin(message, type = 'Error') {
    bot.sendMessage(config.ADMIN_USER, `<b>${type}</b>\n<code>${message}</code>`, {
        parse_mode: 'HTML',
    });
}

function postVacancy(message, link) {
    return bot.sendMessage(config.TARGET_CHANNEL, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        disable_notification: true,
        reply_markup: JSON.stringify({
            inline_keyboard: [[
                { text: 'Подробнее', url: `https://xn--90afahb2cse.xn--p1ai/redirect?to=${link}` },
            ]],
        }),
    });
}

module.exports = {
    postVacancy,
    logMessageToAdmin,
};
