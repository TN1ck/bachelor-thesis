var colors = require('../util/colors.js').colors;
var t      = require('../translations/translation.js');

// All boosters used in this application
module.exports = [
    {
        id: 'booster_x2_1',                   // the id, will be saved in the database
        name: t.booster.booster_x2_1.name, // the general name of the booster
        text: t.booster.booster_x2_1.text, // what will this booster do
        type: 'none',                         // crown of the booster, should be `none`
        fill: colors.vinrouge,                // color of the booster
        image: 'rocket',                      // icon of the booster
        points: 200,                          // price of the booster
        multiplicator: 2,                     // the provided multiplicator
        duration: 1                           // how many days this booster will be active
    },
    {
        id: 'booster_x2_2',
        name: t.booster.booster_x2_2.name,
        text: t.booster.booster_x2_2.text,
        type: 'none',
        fill: colors.vinrouge,
        image: 'rocket',
        points: 400,
        multiplicator: 2,
        duration: 2
    },
    {
        id: 'booster_x3_1',
        name: t.booster.booster_x3_1.name,
        text: t.booster.booster_x3_1.text,
        type: 'none',
        fill: colors.buttercup,
        image: 'rocket',
        points: 600,
        multiplicator: 3,
        duration: 1
    },
    {
        id: 'booster_x3_2',
        name: t.booster.booster_x3_2.name,
        text: t.booster.booster_x3_2.text,
        type: 'none',
        fill: colors.buttercup,
        image: 'rocket',
        points: 1000,
        multiplicator: 3,
        duration: 2
    }
];
