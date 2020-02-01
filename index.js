const request = require('superagent');
const feed = require('feed-read');
const randomUseragent = require('random-useragent');
const config = require('./config.json'); // eslint-disable-line
const HhAdapter = require('./src/adapters/hh');
const MoikrugAdapter = require('./src/adapters/moikrug');
const { TelegramAPI } = require('./src/bot');
const { JobsDAO } = require('./src/jobsDAO');
const { LoadFeedError, ParseFeedError } = require('./src/errors');
const { LoadJobPageDOM } = require('./src/jobLoader');

const dao = new JobsDAO(config.DB_FILE);
const api = new TelegramAPI(config);

async function processFeed(articles, adapter) {
    return Promise.all(
        articles.map(async (article) => {
            const key = adapter.getKey(article);
            const exists = await dao.checkExistence(key);
            if (exists) {
                return null;
            }

            try {
                await dao.save(key, article);
                const document = await LoadJobPageDOM(article.link);
                const res = adapter.parseItem({ ...article, document });
                await api.postVacancy(res, article.link);
            } catch (err) {
                api.notifyAboutError(err.toString());
            }

            return null;
        }),
    );
}

async function loadAndParseFeed(url) {
    let response;
    try {
        response = await request.agent()
            .get(url)
            .set('User-Agent', randomUseragent.getRandom())
            .buffer()
            .type('xml')
            .redirects(10)
            .then();
    } catch (err) {
        throw new LoadFeedError(err);
    }

    return new Promise((resolve, reject) => feed.rss(response.text, null, (err, articles) => {
        if (err) {
            reject(new ParseFeedError(err));
        } else {
            resolve(articles);
        }
    }));
}

async function checkFeed(feedUrl, adapter) {
    try {
        const articles = await loadAndParseFeed(feedUrl);

        await processFeed(articles, adapter);
    } catch (err) {
        await api.notifyAboutError(err.toString());
    }
}

async function run() {
    await checkFeed(config.HH_FEED, HhAdapter);
    await checkFeed(config.MOIKRUG_FEED, MoikrugAdapter);

    setTimeout(run, config.REQUEST_PERIOD_TIME);
}

run();
