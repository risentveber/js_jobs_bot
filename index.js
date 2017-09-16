const feed = require("feed-read");
const config = require('./config.json');
const HhAdapter = require('./adapters/hh');
const MoikrugAdapter = require('./adapters/moikrug');
const bot = require('./bot');
const { FeedItemModel } = require('./lib/models');

function processFeed(articles, adapter) {
  articles.forEach(article => {
    if (adapter.isValid((article))) {
      const key = adapter.getKey(article);
      new FeedItemModel({
        key,
        data: article
      }).save().then(
        model => adapter.parseItem(article).then(bot.postVacancy),
        () => {}
      );
    }
  });
}

setInterval(() => {
    feed(config.HH_FEED, (err, articles) =>{
        if (err) {
            bot.logMessageToAdmin(err);
            return;
        }
        processFeed(articles, HhAdapter);
    });

    feed(config.MOIKRUG_FEED, (err, articles) => {
        if (err) {
            bot.logMessageToAdmin(err);
            return;
        }

        processFeed(articles, MoikrugAdapter);
    });
}, config.REQUEST_PERIOD_TIME);


