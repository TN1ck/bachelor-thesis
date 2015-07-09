var colors = require('../util/colors.js').colors;
var t      = require('../translations/translation.js');

module.exports = [
    {
        id: 'booster_x2_1',
        name: t.booster['booster_x2_1'].name,
        text: t.booster['booster_x2_1'].text,
        type: 'none',
        fill: colors.vinrouge,
        image: 'rocket',
        points: 200,
        multiplicator: 2,
        duration: 1
    },
    {
        id: 'booster_x2_2',
        name: t.booster['booster_x2_2'].name,
        text: t.booster['booster_x2_2'].text,
        type: 'none',
        fill: colors.vinrouge,
        image: 'rocket',
        points: 400,
        multiplicator: 2,
        duration: 2
    },
    {
        id: 'booster_x3_1',
        name: t.booster['booster_x3_1'].name,
        text: t.booster['booster_x3_1'].text,
        type: 'none',
        fill: colors.buttercup,
        image: 'rocket',
        points: 600,
        multiplicator: 3,
        duration: 1
    },
    {
        id: 'booster_x3_2',
        name: t.booster['booster_x3_2'].name,
        text: t.booster['booster_x3_2'].text,
        type: 'none',
        fill: colors.buttercup,
        image: 'rocket',
        points: 1000,
        multiplicator: 3,
        duration: 1
    }
];
