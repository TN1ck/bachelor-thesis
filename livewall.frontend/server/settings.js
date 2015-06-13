module.exports = {
    database: {
        database: 'livewall',
        username: 'test',
        password: '',
        config: {
            dialect: 'sqlite',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            // sqlite only
            storage: './database.sqlite'
            // postgres et al
            // url: 'postgres://user:pass@example.com:5432/dbname'
        }
    }
};
