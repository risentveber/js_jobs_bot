const sqlite3 = require('sqlite3');
const { DatabaseError } = require('./errors');

class JobsDAO {
    constructor(file) {
        // eslint-disable-next-line no-bitwise
        const mode = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;
        this.db = new sqlite3.Database(file, mode, (err) => {
            if (err) {
                console.error(new DatabaseError(err));
            }
        });
        this.db.run('CREATE TABLE IF NOT EXISTS jobs (key TEXT UNIQUE, data TEXT);');
    }

    async save(key, value) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO jobs VALUES (?, ?);', key, JSON.stringify(value), (err, result) => {
                if (err) {
                    reject(new DatabaseError(err));
                } else {
                    resolve(result);
                }
            });
        });
    }

    async checkExistence(key) {
        return new Promise((resolve, reject) => {
            const stmt = 'SELECT EXISTS(SELECT * FROM jobs WHERE key = ? LIMIT 1) as existence;';
            this.db.get(stmt, key, (err, result) => {
                if (err) {
                    reject(new DatabaseError(err));
                } else {
                    resolve(result.existence);
                }
            });
        });
    }
}

module.exports = {
    JobsDAO,
};
