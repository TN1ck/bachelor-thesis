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
            points: 2000,
            id: 'color_blue',
            name: 'Flieder',
            schema: colorFunctions.blue
        },
        {
            points: 2000,
            id: 'color_gray',
            name: 'Grau',
            schema: colorFunctions.gray
        },
        {
            points: 2000,
            id: 'color_green',
            name: 'Grün',
            schema: colorFunctions.green
        }
    ]
};
