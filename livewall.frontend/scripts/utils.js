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
