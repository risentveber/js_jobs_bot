Promise = require('bluebird');
const mongoose = require('mongoose');
global.Promise = Promise;
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/js_jobs_bot');
const db = mongoose.connection;

db.on('error', e => console.error('Сonnection error:', e.message));
db.once('open', () => console.info('Connected to DB!'));

const Schema = mongoose.Schema;

const FeedItem = new Schema({
    data: { type: Object, required: true},
    key: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now }
});

const FeedItemModel = mongoose.model('FeedItem', FeedItem);

module.exports = {
    FeedItemModel
};