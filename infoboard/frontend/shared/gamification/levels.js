var colors = require('../util/colors.js').colors;

// The levels the user can achieve
module.exports = [
    {
        fill: colors.concrete, // color of the level
        image: 'ribbon',       // the icon of the level
        points: 0,             // points needed to have this level
        level: 1               // the level in numerical form
    },
    {
        fill: colors.concrete,
        image: 'ribbon',
        points: 1000,
        level: 2
    },
    {
        fill: colors.concrete,
        image: 'ribbon',
        points: 2000,
        level: 3
    },
    {
        fill: colors.concrete,
        image: 'ribbon',
        points: 3000,
        level: 4
    },
    {
        fill: colors.concrete,
        image: 'ribbon',
        points: 4000,
        level: 5
    }
];
