var schemas = require('../util/colors.js').colorFunctions;

/* The rewards used in this application.
   Currently, only one type is available, that's
   why all rewards have the same structure. */
module.exports = [
    {
        level: 1,                    // at which level this reward will be available
        type: 'color_scheme',        // the type of the reward
        id: 'color_pastel',          // the id of the reward
        name: 'Pastel',              // The name of the reward
        schema: schemas.color_pastel // the color_schema of the reward, this is special for this type
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
