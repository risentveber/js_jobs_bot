const Slimbot = require('slimbot');
const config = require('./config.json');
const bot = new Slimbot(config.TELEGRAM_API_KEY);

[
    'message',
    'edited_message',
    'channel_post',
    'edited_channel_post',
    'callback_query',
    'inline_query',
    'chosen_inline_result',
].forEach(msgType => bot.on(msgType, msg => console.log(msgType, msg)));


bot.startPolling();

function logErrorToAdmin(err) {
    bot.sendMessage(config.ADMIN_USER, `<b>Error</b>\n<code>${err}</code>`, { parse_mode: 'HTML' });
}

function logMessageToAdmin(message) {
    bot.sendMessage(config.ADMIN_USER, `<b>Info</b>\n<code>${message}</code>`, { parse_mode: 'HTML' });
}

function postVacancy(message) {
    bot.sendMessage(config.TARGET_CHANNEL, message,
        { parse_mode: 'HTML', disable_web_page_preview: true, disable_notification: true }
    );
}

module.exports = {
    postVacancy,
    logErrorToAdmin,
    logMessageToAdmin
};
