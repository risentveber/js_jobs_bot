const Slimbot = require('slimbot');

class TelegramAPI extends Slimbot {
    constructor({ ADMIN_USER, TARGET_CHANNEL, TELEGRAM_API_KEY }) {
        super(TELEGRAM_API_KEY);
        this.admin = ADMIN_USER;
        this.channel = TARGET_CHANNEL;
    }

    async notifyAboutError(err, type = 'Error') {
        console.error(err.toString());
        return this.sendMessage(this.admin, `<b>${type}</b>\n<code>${err}</code>`, {
            parse_mode: 'HTML',
        });
    }

    async postVacancy(message, link) {
        // console.log("pub", link)
        return this.sendMessage(this.channel, message, {
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
}

module.exports = {
    TelegramAPI,
};
