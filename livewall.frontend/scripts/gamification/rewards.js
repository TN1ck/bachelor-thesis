import { colorFunctions } from '../util/colors.js';
import { hashCode }       from '../util/utils.js';

export default {
    colors: [
        {
            points: 0,
            id: 'color_pastel',
            name: 'Pastel',
            schema: colorFunctions.pastel
        },
        {
            points: 5000,
            id: 'color_blue',
            name: 'Flieder',
            schema: colorFunctions.blue
        },
        {
            points: 10000,
            id: 'color_gray',
            name: 'Grau',
            schema: colorFunctions.gray
        },
        {
            points: 20000,
            id: 'color_green',
            name: 'Grün',
            schema: colorFunctions.green
        }
    ],
    // background: [
    //     {
    //         points: 0,
    //         id: 'darg_gray',
    //         name: 'Grau',
    //
    //     }
    // ]
};
