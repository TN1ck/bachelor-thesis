/**
 * Extract the domain from an URL
 *
 * @param {String} URL The URL where the domain shall be extracted
 * @returns {String} The domain of the provided URL
 */
function getDomain (url) {
    if (!url) {
        return 'not found';
    }
    var matches = url.match(/\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = (matches && matches[1]) || 'not found';
    return domain;
};

/**
 * Create a numerical hash for the provided string
 * An Implementation of djb2 by DAN BERNSTEIN.
 *
 * @param {String} The string to be hashed
 */
function hashCode(str) {
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

/**
 * Returns 1 if a is larger than b, -1 if it is smaller and 0 when they are the same
 *
 * @param {String} a
 * @param {String} b
 * @returns {Number}
 */
function compareStrings (a, b) {
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
