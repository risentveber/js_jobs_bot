const Slimbot = require('slimbot');
const config = require('./config.json');
const bot = new Slimbot(config.TELEGRAM_API_KEY);

bot.on('message', message => {
    console.log('message', message);
});

bot.on('edited_message', message => {
    console.log('edited_message', message);
});

bot.on('channel_post', post => {
    console.log('channel_post', post);
});

bot.on('edited_channel_post', post => {
    console.log('edited_channel_post', post);
});

bot.on('callback_query', query => {
    console.log('edited_channel_post', query);
});

bot.on('inline_query', query => {
    console.log('inline_query', query);
});

bot.on('chosen_inline_result', result => {
    console.log('chosen_inline_result', result);
});

bot.startPolling();

function logErrorToAdmin(err) {
    bot.sendMessage(config.ADMIN_USER, `<b>Erorr</b>\n<code>${err}</code>`, { parse_mode: 'HTML' });
}

function logMessageToAdmin(message) {
    bot.sendMessage(config.ADMIN_USER, `<b>Info</b>\n<code>${message}</code>`, { parse_mode: 'HTML' });
}

function postVacancy(message) {
    bot.sendMessage(config.TARGET_CHANNEL, message,
        { parse_mode: 'HTML', disable_web_page_preview: true }
        );
}

module.exports = {
    postVacancy,
    logErrorToAdmin,
    logMessageToAdmin
};
