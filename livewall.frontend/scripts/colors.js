import {hashCode} from './utils.js';
import d3         from 'd3';
import _          from 'lodash';

var colorFunctions = {
    pastel: (hash) => {
        var hslStarts = [
            {s: 0.6, l: 0.5},
            {s: 0.5, l: 0.5},
            {s: 0.7, l: 0.5},
            {s: 0.7, l: 0.4},
            {s: 0.8, l: 0.4},
        ];

        var h = hash % 255;
        var sl = hslStarts[hash % hslStarts.length];
        var hsl = d3.hsl(h, sl.s, sl.l);
        return hsl.toString();
    },
    blue: (hash) => {

        var sScale = d3.scale.linear().domain([0, 1]).range([0.2, 0.8]);

        var hslStarts = [
            {h: 207, s: 0.8, l: 0.5},
            {h: 240, s: 0.5, l: 0.5},
            {h: 270, s: 0.5, l: 0.5}
        ];

        var s = sScale((hash / 1000) % 1.0);
        var hsl = hslStarts[hash % hslStarts.length];
        var color = d3.hsl(hsl.h, s, hsl.l);
        return color.toString();
    },
    nice: (hash) => {
        var colors = [
            '#248EE6',
            '#F5A623',
            '#96bf48',
            '#ec663c',
            '#7b3444'
        ];

        return colors(hash % colors.length);
    }
};

var selectedColorFunction = colorFunctions.pastel;

export var getColorByString = function (str) {

    var hash = hashCode(str);
    return selectedColorFunction(hash);

};

// names of the colors accourding to: http://chir.ag/projects/name-that-color/
export var colors = {
    vinrouge:     '#9c4274',
    buttercup:    '#F5A623',
    sushi:        '#96bf48',
    burnt_sienna: '#EC663C',
    puerto_rico:  '#47BBB3',
    curious_blue: '#248EE6'
};
