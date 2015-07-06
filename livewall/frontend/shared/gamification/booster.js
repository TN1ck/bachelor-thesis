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
        id: 'booster_x2_1',
        name: 'VERDOPPLUNG DER PUNKTE FÜR 1 TAG',
        text: 'Verdopple deine Punkte für 1 Tag.',
        type: 'none',
        fill: colors.vinrouge,
        image: icons.key,
        points: 5000,
        multiplicator: 2,
        duration: 1
    },
    {
        id: 'booster_x2_2',
        name: 'VERDOPPLUNG DER PUNKTE FÜR 2 TAG',
        text: 'Verdopple deine Punkte für 2 Tage.',
        type: 'none',
        fill: colors.vinrouge,
        image: icons.key,
        points: 9000,
        multiplicator: 2,
        duration: 2
    },
    {
        id: 'booster_x3_1',
        name: 'VERDREIFACHUNG DER PUNKTE FÜR 1 TAG',
        text: 'Verdreifache deine Punkte für 1 Tag.',
        type: 'none',
        fill: colors.buttercup,
        image: icons.key,
        points: 15000,
        multiplicator: 3,
        duration: 1
    },
    {
        id: 'booster_x3_2',
        name: 'VERDREIFACHUNG DER PUNKTE FÜR 2 TAGE',
        text: 'Verdreifache deine Punkte für 2 Tage.',
        type: 'none',
        fill: colors.buttercup,
        image: icons.key,
        points: 25000,
        multiplicator: 3,
        duration: 1
    }
];
