const request = require('superagent');
const feed = require('feed-read');
const randomUseragent = require('random-useragent');
const config = require('./config.json'); // eslint-disable-line
const HhAdapter = require('./adapters/hh');
const MoikrugAdapter = require('./adapters/moikrug');
const bot = require('./bot');

const { JobsDAO } = require('./lib/jobDAO');

const dao = new JobsDAO(config.DB_FILE);

async function processFeed(articles, adapter) {
    return Promise.all(
        articles.map(async (article) => {
            const key = adapter.getKey(article);
            const exists = await dao.checkExistence(key);
            if (exists) {
                return null;
            }

            try {
                const res = await adapter.parseItem(article);
                await bot.postVacancy(res, article.link);
                await dao.save(key, article);
            } catch (e) {
                console.log(e.toString());
            }

            return null;
        }),
    );
}

async function getFeed(url) {
    return new Promise((resolve, reject) => request.agent()
        .get(url)
        .set('User-Agent', randomUseragent.getRandom())
        .buffer()
        .type('xml')
        .redirects(10)
        .end((err, res) => {
            if (err) {
                reject(err.toString());
                return;
            }

            feed.rss(res.text, null, (feedErr, articles) => {
                if (feedErr) {
                    reject(feedErr.toString());
                } else {
                    resolve(articles);
                }
            });
        }));
}

async function checkFeed(feedUrl, adapter) {
    const articles = await getFeed(feedUrl);

    await processFeed(articles, adapter);
}

async function run() {
    try {
        await Promise.all([
            checkFeed(config.HH_FEED, HhAdapter),
            checkFeed(config.MOIKRUG_FEED, MoikrugAdapter),
        ]);
    } catch (err) {
        console.error(err);
    }

    setTimeout(run, config.REQUEST_PERIOD_TIME);
}

run();
