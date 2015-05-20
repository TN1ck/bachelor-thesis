'use strict';

import _ from 'lodash';
import d3 from 'd3';
import Reflux from 'reflux';
import Immutable from 'immutable';

import {hashCode} from '../utils.js';
import actions from '../actions.js';

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

export var colorStore = Reflux.createStore({

    init: function () {
        this.listenTo(actions.addQuery, this.addQuery);
        this.listenTo(actions.removeQuery, this.removeQuery);
        this.colorFunction = colorFunctions.pastel;
        this.generatedColors = Immutable.Map();
    },

    createColor: function (str) {
        var hash = hashCode(str);
        var color = this.colorFunction(hash);
        this.generatedColors = this.generatedColors.set(str, color);
        return color;
    },

    getColor: function (str) {
        var color = this.generatedColors[str];
        // this case shouldn't happen
        if (!color) {
            return this.createColor(str);
        }
        return color;
    },

    addQuery: function (query) {
        this.createColor(query);
    },

    removeQuery: function (query) {
        this.generatedColors.delete(query);
    }

});
