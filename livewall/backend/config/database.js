module.exports = {
    database: 'livewall',
    username: 'test',
    password: 'testpassword',
    config: {
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        sqlite
        dialect: 'sqlite',
        storage: './database.sqlite',

        // THERE IS A BUG WITH POSTGRES AND A GROUP-BY QUERY. sqlite and mysql are working fine

        // mysql

        // dialect: 'mysql',
        // host: '127.0.0.1',
        // port: 3306

    }
};
