const request = require('superagent');
const feed = require('feed-read');
const randomUseragent = require('random-useragent');
const config = require('./config.json'); // eslint-disable-line
const HhAdapter = require('./adapters/hh');
const MoikrugAdapter = require('./adapters/moikrug');
const bot = require('./bot');
const { FeedItemModel } = require('./lib/models');

function processFeed(articles, adapter) {
    articles.forEach((article) => {
        if (adapter.isValid((article))) {
            const key = adapter.getKey(article);
            new FeedItemModel({
                key,
                data: article,
            }).save().then(() => adapter.parseItem(article)
                .then(res => bot.postVacancy(res, article.link)
                    .catch(e => console.error(new Date(), e.toString(), res)))).catch(() => {});
        }
    });
}

function getFeed(url, callback) {
    request.agent()
        .get(url)
        .set('User-Agent', randomUseragent.getRandom())
        .buffer()
        .type('xml')
        .redirects(10)
        .end((err, res) => {
            if (err) {
                callback(err);
                return;
            }
            feed.rss(res.text, null, callback);
        });
}

setInterval(() => {
    getFeed(config.HH_FEED, (err, articles) => {
        if (err) {
            bot.logMessageToAdmin(err);
            return;
        }
        processFeed(articles, HhAdapter);
    });

    getFeed(config.MOIKRUG_FEED, (err, articles) => {
        if (err) {
            bot.logMessageToAdmin(err);
            return;
        }

        processFeed(articles, MoikrugAdapter);
    });
}, config.REQUEST_PERIOD_TIME);
