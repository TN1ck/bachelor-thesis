var schemas = require('../util/colors.js').colorFunctions

module.exports = [
    {
        points: 0,
        id: 'color_pastel',
        name: 'Pastel',
        schema: schemas.pastel
    },
    {
        points: 5000,
        id: 'color_blue',
        name: 'Flieder',
        schema: schemas.blue
    },
    {
        points: 10000,
        id: 'color_gray',
        name: 'Grau',
        schema: schemas.gray
    },
    {
        points: 20000,
        id: 'color_green',
        name: 'Grün',
        schema: schemas.green
    }
];
