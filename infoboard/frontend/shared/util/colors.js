var hashCode = require('./utils.js').hashCode;
var d3       = require('d3');
var _        = require('lodash');
var husl     = require('husl');

// every function in this dictionary, will return a color for a numerical hash
var colorFunctions = {
    color_rgb: function (hash) {
        hash = hash % 65535;
        var rgb = _.parseInt(hash, 16);
        rgb = _.padLeft(rgb, 6, '0');
        return '#' + rgb;
    },
    color_hsl: function (hash) {
        var h = (hash / 100) % 360.0;
        return d3.hsl(h, 0.5, 0.6);
    },
    color_pastel_hcl: function (hash) {
        var h = (hash / 100) % 270.0 + 10;
        return d3.hcl(h, 70, 45);
    },
    color_pastel: function (hash) {
        var hslStarts = [
            {s: 0.5, l: 0.4},
            {s: 0.4, l: 0.4},
            {s: 0.5, l: 0.4},
            {s: 0.6, l: 0.3},
            {s: 0.7, l: 0.3}
        ];

        // above 270 we get pink values, they do not look good
        var h = (hash / 100) % 270;
        var sl = hslStarts[hash % hslStarts.length];
        var hsl = d3.hsl(h, sl.s, sl.l);
        return hsl.toString();
    },
    color_pastel_husl: function (hash) {
        var hslStarts = [
            {s: 0.6, l: 0.4},
            {s: 0.5, l: 0.4},
            {s: 0.6, l: 0.4},
            {s: 0.7, l: 0.3},
            {s: 0.8, l: 0.3}
        ];

        var h = hash % 270;
        var sl = hslStarts[hash % hslStarts.length];
        return husl.toHex(h, sl.s * 100, sl.l * 100);
    },
    color_blue: function (hash) {

        var sScale = d3.scale.linear().domain([0, 1]).range([0.2, 0.8]);

        var hslStarts = [
            {h: 207, s: 0.8, l: 0.5},
            {h: 240, s: 0.5, l: 0.4},
            {h: 270, s: 0.5, l: 0.6},
            {h: 260, s: 0.5, l: 0.4}
        ];

        var s = sScale((hash / 1000) % 1.0);
        var hsl = hslStarts[hash % hslStarts.length];
        var color = d3.hsl(hsl.h, s, hsl.l);
        return color.toString();
    },
    color_green: function (hash) {

        var sScale = d3.scale.linear().domain([0, 1]).range([0.2, 0.8]);

        var hslStarts = [
            {h: 80, s: 0.8,  l: 0.5},
            {h: 90, s: 0.5,  l: 0.3},
            {h: 100, s: 0.5, l: 0.4},
            {h: 140, s: 0.5, l: 0.4}
        ];

        var s = sScale((hash / 1000) % 1.0);
        var hsl = hslStarts[hash % hslStarts.length];
        var color = d3.hsl(hsl.h, s, hsl.l);
        return color.toString();
    },
    color_gray: function (hash) {

        var lScale = d3.scale.linear().domain([0, 1]).range([0, 0.6]);

        var hslStarts = [
            {h: 207, s: 0, l: 0.5}
        ];

        var l = lScale((hash / 1000) % 1.0);
        var hsl = hslStarts[hash % hslStarts.length];
        var color = d3.hsl(hsl.h, hsl.s, l);
        return color.toString();
    },
    color_flat: function (hash) {
        // taken fram flatuicolors - https://flatuicolors.com
        var colors = [
            '#1dd2af', '#19b698', '#40d47e', '#2cc36b',
            '#4aa3df', '#2e8ece', '#a66bbe', '#9b50ba',
            '#3d566e', '#354b60', '#f2ca27', '#f4a62a',
            '#e98b39', '#ec5e00', '#ea6153', '#d14233',
            '#bdc3c7', '#cbd0d3', '#a3b1b2', '#8c989'
        ];

        return colors(hash % colors.length);
    }
};

/**
 * Will return a consistent color for the provided string.
 * The color is generated with the provided colorscheme
 *
 * @param {String} str
 * @param {Function} scheme The colorscheme
 * @returns
 */
var getColorByString = function (str, scheme) {

    var hash = hashCode(str);
    return _.get(colorFunctions, scheme, colorFunctions.pastel_color)(hash);

};

// names of the colors accourding to: http://chir.ag/projects/name-that-color/
// list of nice colors, that are used throughout the application
var colors = {
    crimson:      '#ef233c',
    vinrouge:     '#9C4274',
    buttercup:    '#F5A623',
    sushi:        '#96BF48',
    burnt_sienna: '#EC663C',
    puerto_rico:  '#47BBB3',
    curious_blue: '#248EE6',
    concrete:     '#95A5A6'
};

module.exports = {
    colors: colors,
    getColorByString: getColorByString,
    colorFunctions: colorFunctions
};
