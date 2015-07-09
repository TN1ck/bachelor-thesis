var schemas = require('../util/colors.js').colorFunctions

module.exports = [
    {
        level: 1,
        type: 'color_scheme',
        id: 'color_pastel',
        name: 'Pastel',
        schema: schemas.color_pastel
    },
    {
        level: 1,
        type: 'color_scheme',
        id: 'color_rgb',
        name: 'Random RGB',
        schema: schemas.color_rgb
    },
    {
        level: 2,
        type: 'color_scheme',
        id: 'color_pastel_husl',
        name: 'Pastel HUSL',
        schema: schemas.color_pastel_husl
    },
    {
        level: 2,
        type: 'color_scheme',
        id: 'color_pastel_hcl',
        name: 'Pastel HCL',
        schema: schemas.color_pastel_hcl
    },
    {
        level: 2,
        type: 'color_scheme',
        id: 'color_blue',
        name: 'Flieder',
        schema: schemas.color_blue
    },
    {
        level: 3,
        type: 'color_scheme',
        id: 'color_gray',
        name: 'Grau',
        schema: schemas.color_gray
    },
    {
        level: 4,
        type: 'color_scheme',
        id: 'color_green',
        name: 'Grün',
        schema: schemas.color_green
    }
];
