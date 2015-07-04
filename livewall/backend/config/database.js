module.exports = {
    database: 'livewall',
    username: 'test',
    password: 'testpassword',
    config: {
        // dialect: 'sqlite',
        // dialect: 'postgres',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        // sqlite only
        // storage: './database.sqlite',

        // THERE IS A BUG WITH POSTGRES AND A GROUP-BY QUERY. sqlite and mysql are working fine
        // postgres et al

        // port: 5432,
        // host: '127.0.0.1'

        // mysql

        host: '127.0.0.1',
        port: 3306

    }
};
