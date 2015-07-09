var camelCaseToBar = function (str) {
    return str[0].toLowerCase() + str.slice(1, str.length).replace(/([A-Z])/g, function($1){return '|'+$1.toLowerCase();});
};

var getDomain = function (url) {
    if (!url) {
        return 'not found';
    }
    var matches = url.match(/\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = (matches && matches[1]) || 'not found';
    return domain;
};

// An Implementation of djb2 by DAN BERNSTEIN
var hashCode = function(str) {
    var hash = 5381;
    if (str.length === 0) {
        return hash;
    }
    for (var i = 0; i < str.length; i++) {
        var character  = str.charCodeAt(i);
        hash  = (( hash << 5 ) + hash ) ^ character;
    }
    return hash >>> 0; // make it positive
}

var parseColor = function (hex) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    var result = [];

    for (var i = 0; i < 3; i++) {
        var c = parseInt(hex.substr(i*2,2), 16);
        result.push(c);
    }
    return {
        r: result[0],
        g: result[1],
        b: result[2]
    };
};

var colorLuminance = function (hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
};

var compareStrings = function (a, b) {
    if (a === b) {
        return 0;
    } else {
        return a > b ? 1 : -1;
    }
};

module.exports = {
    camelCaseToBar: camelCaseToBar,
    getDomain:      getDomain,
    hashCode:       hashCode,
    parseColor:     parseColor,
    colorLuminance: colorLuminance,
    compareStrings: compareStrings
};
