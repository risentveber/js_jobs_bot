const sqlite3 = require('sqlite3');

class JobsDAO {
    constructor(file) {
        // eslint-disable-next-line no-bitwise
        const mode = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;
        this.db = new sqlite3.Database(file, mode, (err) => {
            if (err) {
                console.error(err);
            }
        });
        this.db.run('CREATE TABLE IF NOT EXISTS jobs (key TEXT UNIQUE, data TEXT);');
    }

    save(key, value) {
        console.log('save call');
        this.db.run('INSERT INTO jobs VALUES (?, ?);', key, JSON.stringify(value), console.log);
    }

    checkExistence(key) {
        return new Promise((resolve, reject) => {
            const stmt = 'SELECT EXISTS(SELECT * FROM jobs WHERE key = ? LIMIT 1) as existence;';
            this.db.get(stmt, key, (err, result) => {
                if (err) {
                    reject(err);
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
