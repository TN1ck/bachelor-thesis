'use strict';

export var camelCaseToBar = function (str) {
	return str[0].toLowerCase() + str.slice(1, str.length).replace(/([A-Z])/g, function($1){return '|'+$1.toLowerCase();});
};
