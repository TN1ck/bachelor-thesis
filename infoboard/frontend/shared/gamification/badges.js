var colors = require('../util/colors.js').colors;

// All badges used in this application
// the translations cannot be set directly here, only the keys used for them
module.exports = [
    /*
        NUMBER OF LOGINS
    */
    {
        id: 'login_1',                    // the id of the badge, will be saved in the database
        number: 1,                        // most of the time there is a number associoted with the badges
        name: '.badges.login_1.header',    // the general name of t badge
        why: '.badges.login_1.why',        // why did the user get t badge
        text: '.badges.login_1.text',      // what the user needs to do, to get t badge
        type: 'none',                     // specifies the crown of the badge
        fill: colors.vinrouge,            // specifies the color
        image: 'key',                     // specifies the icon, see `assets`
        points: 50                        // how many points will this badge earn the user
    },
    {
        id: 'login_50',
        number: 50,
        name: '.badges.login_50.header',
        why: '.badges.login_50.why',
        text: '.badges.login_50.text',
        type: 'king',
        fill: colors.vinrouge,
        image: 'key',
        points: 500
    },
    {
        id: 'login_100',
        number: 100,
        name: '.badges.login_100.header',
        why: '.badges.login_100.why',
        text: '.badges.login_100.text',
        type: 'emperor',
        fill: colors.vinrouge,
        image: 'key',
        points: 1000
    },
    /*
        NUMBER OF CONSECUTIVE LOGINS
    */
    {
        id: 'login_3_c',
        number: 3,
        name: '.badges.login_3_c.header',
        why: '.badges.login_3_c.why',
        text: '.badges.login_3_c.text',
        type: 'none',
        fill: colors.buttercup,
        image: 'repeat',
        points: 100
    },
    {
        id: 'login_7_c',
        number: 7,
        name: '.badges.login_7_c.header',
        why: '.badges.login_7_c.why',
        text: '.badges.login_7_c.text',
        type: 'king',
        fill: colors.buttercup,
        image: 'repeat',
        points: 500
    },
    {
        id: 'repeat_15_c',
        number: 15,
        name: '.badges.repeat_15_c.header',
        why: '.badges.repeat_15_c.why',
        text: '.badges.repeat_15_c.text',
        type: 'emperor',
        fill: colors.buttercup,
        image: 'repeat',
        points: 1000
    },
    /*
        NUMBER OF UPVOTES
    */
    {
        id: 'upvotes_10',
        number: 10,
        name: '.badges.upvotes_10.header',
        why: '.badges.upvotes_10.why',
        text: '.badges.upvotes_10.text',
        type: 'none',
        fill: colors.sushi,
        image: 'upvote',
        points: 50
    },
    {
        id: 'upvotes_100',
        number: 100,
        name: '.badges.upvotes_100.header',
        why: '.badges.upvotes_100.why',
        text: '.badges.upvotes_100.text',
        type: 'king',
        fill: colors.sushi,
        image: 'upvote',
        points: 300
    },
    {
        id: 'upvotes_1000',
        number: 1000,
        name: '.badges.upvotes_1000.header',
        why: '.badges.upvotes_1000.why',
        text: '.badges.upvotes_1000.text',
        type: 'emperor',
        fill: colors.sushi,
        image: 'upvote',
        points: 100
    },
    /*
        NUMBER OF DOWNVOTES
    */
    {
        id: 'downvotes_10',
        number: 10,
        name: '.badges.downvotes_10.header',
        why: '.badges.downvotes_10.why',
        text: '.badges.downvotes_10.text',
        type: 'none',
        fill: colors.burnt_sienna,
        image: 'downvote',
        points: 50
    },
    {
        id: 'downvotes_100',
        number: 100,
        name: '.badges.downvotes_100.header',
        why: '.badges.downvotes_100.why',
        text: '.badges.downvotes_100.text',
        type: 'king',
        fill: colors.burnt_sienna,
        image: 'downvote',
        points: 300
    },
    {
        id: 'downvotes_1000',
        number: 1000,
        name: '.badges.downvotes_1000.header',
        why: '.badges.downvotes_1000.why',
        text: '.badges.downvotes_1000.text',
        type: 'emperor',
        fill: colors.burnt_sienna,
        image: 'downvote',
        points: 1000
    },
    /*
        NUMBER OF QUERIES
    */
    {
        id: 'queries_add_10',
        number: 10,
        name: '.badges.queries_add_10.header',
        why: '.badges.queries_add_10.why',
        text: '.badges.queries_add_10.text',
        type: 'none',
        fill: colors.puerto_rico,
        image: 'query',
        points: 50
    },
    {
        id: 'queries_add_100',
        number: 100,
        name: '.badges.queries_add_100.header',
        why: '.badges.queries_add_100.why',
        text: '.badges.queries_add_100.text',
        type: 'king',
        fill: colors.puerto_rico,
        image: 'query',
        points: 300
    },
    {
        id: 'queries_add_1000',
        number: 1000,
        name: '.badges.queries_add_1000.header',
        why: '.badges.queries_add_1000.why',
        text: '.badges.queries_add_1000.text',
        type: 'emperor',
        fill: colors.puerto_rico,
        image: 'query',
        points: 1000
    },
    /*
        NUMBER OF FAVORITES
    */
    {
        id: 'favourites_10',
        number: 10,
        name: '.badges.favourites_10.header',
        why: '.badges.favourites_10.why',
        text: '.badges.favourites_10.text',
        type: 'none',
        fill: colors.curious_blue,
        image: 'star',
        points: 100
    },
    {
        id: 'favourites_50',
        number: 50,
        name: '.badges.favourites_50.header',
        why: '.badges.favourites_50.why',
        text: '.badges.favourites_50.text',
        type: 'king',
        fill: colors.curious_blue,
        image: 'star',
        points: 300
    },
    {
        id: 'favourites_100',
        number: 100,
        name: '.badges.favourites_100.header',
        why: '.badges.favourites_100.why',
        text: '.badges.favourites_100.text',
        type: 'emperor',
        fill: colors.curious_blue,
        image: 'star',
        points: 1000
    }
];
