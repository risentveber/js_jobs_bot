class LoadFeedError extends Error {
    constructor(err) {
        super(err.message);
        this.name = 'LoadFeedError';
    }
}

class ParseFeedError extends Error {
    constructor(err) {
        super(err.message);
        this.name = 'ParseFeedError';
    }
}

class LoadJobError extends Error {
    constructor(err, link) {
        super(`${err.message} ${link}`);
        this.name = 'LoadJobError';
    }
}

class ParseJobError extends Error {
    constructor(err, link) {
        super(`${err.message} ${link}`);
        this.name = 'ParseJobError';
    }
}

class DatabaseError extends Error {
    constructor(err) {
        super(err.message);
        this.name = 'DatabaseError';
    }
}

module.exports = {
    LoadFeedError,
    ParseFeedError,
    LoadJobError,
    ParseJobError,
    DatabaseError,
};
