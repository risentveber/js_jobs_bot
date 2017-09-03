const feed = require("feed-read");
const config = require('./config.json');
const HhAdapter = require('./adapters/hh');
const MoikrugAdapter = require('./adapters/moikrug');
const bot = require('./bot');
const { FeedItemModel } = require('./lib/models');

let queue;

setInterval(() => {
    let queue = [];
    feed(config.HH_FEED, function (err, articles) {
        if (err) {
            bot.logErrorToAdmin(err);
            return;
        } else {
            // bot.logMessageToAdmin(`HH Parsed, total length: ${articles.length}`);
        }

        articles.forEach(article => {
            if (HhAdapter.isValid((article))) {
                const key = HhAdapter.getKey(article);
                const promise = new FeedItemModel({
                    key,
                    data: article
                }).save().then(
                    model => bot.postVacancy(HhAdapter.parseItem(article)),
                    err => console.log('already posted', key)
                );
                queue.push(promise);
            }
        });
    });

    feed(config.MOIKRUG_FEED, function (err, articles) {
        if (err) {
            bot.logErrorToAdmin(err);
            return;
        } else {
            // bot.logMessageToAdmin(`Moikrug parsed, total length: ${articles.length}`);
        }

        articles.forEach(article => {
            if (MoikrugAdapter.isValid((article))) {
                const key = MoikrugAdapter.getKey(article);
                const promise = new FeedItemModel({
                    key,
                    data: article
                }).save().then(
                    model => bot.postVacancy(MoikrugAdapter.parseItem(article)),
                    err => console.log('already posted', key)
                );
                queue.push(promise);
            }
        });
    });
}, 5000 * 60);


