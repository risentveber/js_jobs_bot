const feed = require("feed-read");
const config = require('./config.json');
const HhAdapter = require('./adapters/hh');
const MoikrugAdapter = require('./adapters/moikrug');
const bot = require('./bot');
const { FeedItemModel } = require('./lib/models');

let queue;

setInterval(() => {
    queue = [];
    feed(config.HH_FEED, function (err, articles) {
        if (err) {
            bot.logErrorToAdmin(err);
            return;
        }

        articles.forEach(article => {
            if (HhAdapter.isValid((article))) {
                const key = HhAdapter.getKey(article);
                const promise = new FeedItemModel({
                    key,
                    data: article
                }).save().then(
                    model => HhAdapter.parseItem(article).then(bot.postVacancy),
                    () => {}
                );
                queue.push(promise);
            }
        });
    });

    feed(config.MOIKRUG_FEED, function (err, articles) {
        if (err) {
            bot.logErrorToAdmin(err);
            return;
        }

        articles.forEach(article => {
            if (MoikrugAdapter.isValid((article))) {
                const key = MoikrugAdapter.getKey(article);
                const promise = new FeedItemModel({
                    key,
                    data: article
                }).save().then(
                    model => MoikrugAdapter.parseItem(article).then(bot.postVacancy),
                    () => {}
                );
                queue.push(promise);
            }
        });
    });
}, 5000 * 60);


