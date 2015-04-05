'use strict';

export var camelCaseToBar = function (str) {
	return str[0].toLowerCase() + str.slice(1, str.length).replace(/([A-Z])/g, function($1){return '|'+$1.toLowerCase();});
};

export var getDomain = function (url) {
    if (!url) {
        return 'not found';
    }
    var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = (matches && matches[1]) || 'not found';
    return domain;
};


export var hashCode = function (str) {
    var hash = 0;
	if (str.length === 0) {
		return hash;
	}

	for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash < 0 ? hash * -1 : hash;
};

export var colorLuminance = function (hex, lum) {

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


// export var colors = ['#D65B3C', '#D77F47', '#D9AA5A', '#2980b9', '#19806E', '#AE8EA7'];
export var colors = ['#248EE6', '#F5A623', '#96bf48', '#ec663c', '#47bbb3', '#9c4274'];
// export var colors = ['#27ae60', '#2980b9', '#16a085', '#3498db', '#2ecc71', '#1abc9c', '#c0392b', '#e74c3c', '#e67e22', '#d35400', '#f39c12', '#f1c40f'];
// export var colors = ['#c0392b', '#e74c3c', '#e67e22', '#d35400', '#f39c12', '#f1c40f'];
