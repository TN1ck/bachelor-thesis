var colors = require('../util/colors.js').colors;
var t      = require('../translations/translation.js');

var icons = {
    key:      '/assets/key.png',
    repeat:   '/assets/repeat.png',
    upvote:   '/assets/upvote.png',
    downvote: '/assets/downvote.png',
    search:   '/assets/search.png',
    star:     '/assets/star.png'

};

module.exports = [
    /*
        NUMBER OF LOGINS
    */
    {
        id: 'login_1',
        name: t.badges['login_1'].header,
        text: t.badges['login_1'].text,
        number: '1',
        type: 'none',
        fill: colors.vinrouge,
        image: icons.key,
        points: 50
    },
    {
        id: 'login_50',
        name: t.badges['login_50'].header,
        text: t.badges['login_50'].text,
        number: '50',
        type: 'king',
        fill: colors.vinrouge,
        image: icons.key,
        points: 500
    },
    {
        id: 'login_100',
        name: t.badges['login_100'].header,
        text: t.badges['login_100'].text,
        number: '100',
        type: 'emperor',
        fill: colors.vinrouge,
        image: icons.key,
        points: 1000
    },
    /*
        NUMBER OF CONSECUTIVE LOGINS
    */
    {
        id: 'login_3_c',
        name: t.badges['login_3_c'].header,
        text: t.badges['login_3_c'].text,
        number: '3',
        type: 'none',
        fill: colors.buttercup,
        image: icons.repeat,
        points: 100
     },
    {
        id: 'login_7_c',
        name: t.badges['login_7_c'].header,
        text: t.badges['login_7_c'].text,
        number: '7',
        type: 'king',
        fill: colors.buttercup,
        image: icons.repeat,
        points: 500
    },
    {
        id: 'repeat_15_c',
        name: t.badges['repeat_15_c'].header,
        text: t.badges['repeat_15_c'].text,
        number: '15',
        type: 'emperor',
        fill: colors.buttercup,
        image: icons.repeat,
        points: 1000
    },
    /*
        NUMBER OF UPVOTES
    */
    {
        id: 'upvotes_10',
        name: t.badges['upvotes_10'].header,
        text: t.badges['upvotes_10'].text,
        number: '10',
        type: 'none',
        fill: colors.sushi,
        image: icons.upvote,
        points: 50
    },
    {
        id: 'upvotes_100',
        name: t.badges['upvotes_100'].header,
        text: t.badges['upvotes_100'].text,
        number: '100',
        type: 'king',
        fill: colors.sushi,
        image: icons.upvote,
        points: 300
    },
    {
        id: 'upvotes_1000',
        name: t.badges['upvotes_1000'].header,
        text: t.badges['upvotes_1000'].text,
        number: '1000',
        type: 'emperor',
        fill: colors.sushi,
        image: icons.upvote,
        points: 100
    },
    /*
        NUMBER OF DOWNVOTES
    */
    {
        id: 'downvotes_10',
        name: t.badges['downvotes_10'].header,
        text: t.badges['downvotes_10'].text,
        number: '10',
        type: 'none',
        fill: colors.burnt_sienna,
        image: icons.downvote,
        points: 50
    },
    {
        id: 'downvotes_100',
        name: t.badges['downvotes_100'].header,
        text: t.badges['downvotes_100'].text,
        number: '100',
        type: 'king',
        fill: colors.burnt_sienna,
        image: icons.downvote,
        points: 300
    },
    {
        id: 'downvotes_1000',
        name: t.badges['downvotes_1000'].header,
        text: t.badges['downvotes_1000'].text,
        number: '1000',
        type: 'emperor',
        fill: colors.burnt_sienna,
        image: icons.downvote,
        points: 1000
    },
    /*
        NUMBER OF QUERIES
    */
    {
        id: 'queries_10',
        name: t.badges['queries_10'].header,
        text: t.badges['queries_10'].text,
        number: '10',
        type: 'none',
        fill: colors.puerto_rico,
        image: icons.search,
        points: 50
    },
    {
        id: 'queries_100',
        name: t.badges['queries_100'].header,
        text: t.badges['queries_100'].text,
        number: '100',
        type: 'king',
        fill: colors.puerto_rico,
        image: icons.search,
        points: 300
    },
    {
        id: 'queries_1000',
        name: t.badges['queries_1000'].header,
        text: t.badges['queries_1000'].text,
        number: '1000',
        type: 'emperor',
        fill: colors.puerto_rico,
        image: icons.search,
        points: 1000
    },
    /*
        NUMBER OF FAVORITES
    */
    {
        id: 'favourites_10',
        name: t.badges['favourites_10'].header,
        text: t.badges['favourites_10'].text,
        number: '10',
        type: 'none',
        fill: colors.curious_blue,
        image: icons.star,
        points: 100
    },
    {
        id: 'favourites_50',
        name: t.badges['favourites_50'].header,
        text: t.badges['favourites_50'].text,
        number: '50',
        type: 'king',
        fill: colors.curious_blue,
        image: icons.star,
        points: 300
    },
    {
        id: 'favourites_100',
        name: t.badges['favourites_100'].header,
        text: t.badges['favourites_100'].text,
        number: '100',
        type: 'emperor',
        fill: colors.curious_blue,
        image: icons.star,
        points: 1000
    }
];
