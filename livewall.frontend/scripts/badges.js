import { colors } from './colors.js';

var icons = {
    key:      '/assets/key.png',
    repeat:   '/assets/repeat.png',
    upvote:   '/assets/upvote.png',
    downvote: '/assets/downvote.png',
    search:   '/assets/search.png',
    star:     '/assets/star.png'

};

export var badges = [
    /*
        NUMBER OF LOGINS
    */
    {
        id: 'login_1',
        name: 'ANMELDUNG',
        text: 'Melde dich einmal an der DAI-Wall an um diese Trophäe zu erhalten.',
        number: '1',
        type: 'none',
        fill: colors.vinrouge,
        image: icons.key,
        points: 50
    },
    {
        id: 'login_50',
        name: 'ANMELDUNGEN',
        text: 'Melde dich 50 mal an der DAI-Wall an um diese Trophäe zu erhalten.',
        number: '50',
        type: 'king',
        fill: colors.vinrouge,
        image: icons.key,
        points: 500
    },
    {
        id: 'login_100',
        name: 'ANMELDUNGEN',
        text: 'Melde dich 100 an der DAI-Wall an um diese Trophäe zu erhalten.',
        number: '100',
        type: 'emperor',
        fill: colors.vinrouge,
        image: icons.key,
        points: 1000
    },
    /*
        NUMBER OF CONSECUTIVE LOGINS
    */
    {
        id: 'login_3_c',
        name: 'TAGE IN FOLGE',
        text: 'Melde dich an 3 aufeinanderfolgenden Tagen an der DAI-Wall an um diese Trophäe zu erhalten',
        number: '3',
        type: 'none',
        fill: colors.buttercup,
        image: icons.repeat,
        points: 100
     },
    {
        id: 'login_7_c',
        name: 'TAGE IN FOLGE',
        text: 'Melde dich an 7 aufeinanderfolgenden Tagen an der DAI-Wall an um diese Trophäe zu erhalten',
        number: '7',
        type: 'king',
        fill: colors.buttercup,
        image: icons.repeat,
        points: 500
    },
    {
        id: 'repeat_15_c',
        name: 'TAGE IN FOLGE',
        text: 'Melde dich an 15 aufeinanderfolgenden Tagen an der DAI-Wall an um diese Trophäe zu erhalten',
        number: '15',
        type: 'emperor',
        fill: colors.buttercup,
        image: icons.repeat,
        points: 1000
    },
    /*
        NUMBER OF UPVOTES
    */
    {
        id: 'upvotes_10',
        name: 'UPVOTES',
        text: 'Bewerte mindestens 10 Suchergebnisse positiv um diese Trophäe zu erhalten.',
        number: '10',
        type: 'none',
        fill: colors.sushi,
        image: icons.upvote,
        points: 50
    },
    {
        id: 'upvotes_100',
        name: 'UPVOTES',
        text: 'Bewerte mindestens 100 Suchergebnisse positiv um diese Trophäe zu erhalten.',
        number: '100',
        type: 'king',
        fill: colors.sushi,
        image: icons.upvote,
        points: 300
    },
    {
        id: 'upvotes_1000',
        name: 'UPVOTES',
        text: 'Bewerte mindestens 1000 Suchergebnisse positiv um diese Trophäe zu erhalten.',
        number: '1000',
        type: 'emperor',
        fill: colors.sushi,
        image: icons.upvote,
        points: 100
    },
    /*
        NUMBER OF DOWNVOTES
    */
    {
        id: 'downvotes_10',
        name: 'DOWNVOTES',
        text: 'Bewerte mindestens 10 Suchergebnisse negativ um diese Trophäe zu erhalten.',
        number: '10',
        type: 'none',
        fill: colors.burnt_sienna,
        image: icons.downvote,
        points: 50
    },
    {
        id: 'downvotes_100',
        name: 'DOWNVOTES',
        text: 'Bewerte mindestens 100 Suchergebnisse negativ um diese Trophäe zu erhalten.',
        number: '100',
        type: 'king',
        fill: colors.burnt_sienna,
        image: icons.downvote,
        points: 300
    },
    {
        id: 'downvotes_1000',
        name: 'DOWNVOTES',
        text: 'Bewerte mindestens 1000 Suchergebnisse negativ um diese Trophäe zu erhalten.',
        number: '1000',
        type: 'emperor',
        fill: colors.burnt_sienna,
        image: icons.downvote,
        points: 1000
    },
    /*
        NUMBER OF QUERIES
    */
    {
        id: 'queries_10',
        name: 'SUCHEN',
        number: '10',
        type: 'none',
        fill: colors.puerto_rico,
        image: icons.search,
        points: 50
    },
    {
        id: 'queries_100',
        name: 'SUCHEN',
        number: '100',
        type: 'king',
        fill: colors.puerto_rico,
        image: icons.search,
        points: 300
    },
    {
        id: 'queries_1000',
        name: 'SUCHEN',
        number: '1000',
        type: 'emperor',
        fill: colors.puerto_rico,
        image: icons.search,
        points: 1000
    },
    /*
        NUMBER OF FAVORITES
    */
    {
        id: 'favourites_10',
        name: 'FAVORITEN',
        number: '10',
        type: 'none',
        fill: colors.curious_blue,
        image: icons.star,
        points: 100
    },
    {
        id: 'favourites_50',
        name: 'FAVORITEN',
        number: '50',
        type: 'king',
        fill: colors.curious_blue,
        image: icons.star,
        points: 300
    },
    {
        id: 'favourites_100',
        name: 'FAVORITEN',
        number: '100',
        type: 'emperor',
        fill: colors.curious_blue,
        image: icons.star,
        points: 1000
    }
];

/*

    PROCESSING FUNCTIONS

*/

var authLoginTrophies = (_data) => {

    var trophies = [];
    var results   = {}

    /*
        check for consecutive logins and number of logins
    */

    var data = _.get(_data, '.auth.login');

    if (!data) {
        return {
            trophies: trophies,
            results: results
        }
    }

    var rows = data.rows;

    // remove all date-duplicates
    var uniqueLoginRows = _.unique(rows, true, x => x.date);

    // iterate over the sorted array and if consecutive rows are 1 day apart
    // the logins are also consecutive
    var maxConsecutiveLogins = 1;
    var current = 1;

    var last = _.first(rows);

    _.rest(uniqueLoginRows).forEach(row => {

        var lastDate = _.parseInt(last.date);
        var date     = _.parseInt(row.date);
        if (Math.abs(lastDate - date) === 1) {
            current += 1;
        } else {
            maxConsecutiveLogins = Math.max(current, maxConsecutiveLogins);
            current = 1;
        }

        last = row;

    });

    maxConsecutiveLogins = Math.max(current, maxConsecutiveLogins);

    // give the trophies and set the data
    var numberOfLogins = uniqueLoginRows.length;

    if (numberOfLogins >= 1) {
        trophies.push('login_1');
    }

    if (numberOfLogins >= 50) {
        trophies.push('login_50');
    }

    if (numberOfLogins >= 50) {
        trophies.push('login_100');
    }


    if (maxConsecutiveLogins >= 3) {
        trophies.push('login_3_c');
    }
    if (maxConsecutiveLogins >= 7) {
        trophies.push('login_7_c');
    }
    if (maxConsecutiveLogins >= 15) {
        trophies.push('login_15_c');
    }

    return {
        trophies: trophies,
        results: {
            numberOfLogins: numberOfLogins,
            maxConsecutiveLogins: maxConsecutiveLogins
        }
    };

};

var voteUpTrophies = (_data) => {

    var trophies = [];
    var results  = {};

    /*
        check for number of upvotes
    */

    var data = _.get(_data, '.vote.up');

    if (!data) {
        return {
            trophies: trophies,
            results: results
        }
    }

    var numberOfUpvotes = data.count;

    results.numberOfUpvotes = numberOfUpvotes;

    if (numberOfUpvotes >= 10) {
        trophies.push('upvotes_10');
    }
    if (numberOfUpvotes >= 100) {
        trophies.push('upvotes_100');
    }
    if (numberOfUpvotes >= 1000) {
        trophies.push('upvotes_1000');
    }

    return {
        trophies: trophies,
        results: results
    };

};

var voteDownTrophies = (_data) => {

    var trophies = [];
    var results  = {};

    /*
        check for number of downvotes
    */

    var data = _.get(_data, '.vote.down');

    if (!data) {
        return {
            trophies: trophies,
            results: results
        }
    }

    var numberOfDownvotes = data.count;

    results.numberOfDownvotes = numberOfDownvotes;

    if (numberOfDownvotes >= 10) {
        trophies.push('downvotes_10');
    }
    if (numberOfDownvotes >= 100) {
        trophies.push('downvotes_100');
    }
    if (numberOfDownvotes >= 1000) {
        trophies.push('downvotes_1000');
    }

    return {
        trophies: trophies,
        results:   results
    };

};

var addQuerieTrophies = (_data) => {

    var trophies = [];
    var results  = {};


    /*
        check for number of favourites
    */

    var data = _.get(_data, '.search.add');

    if (!data) {
        return {
            trophies: trophies,
            results: results
        }
    }

    var numberOfQueries = data.count;

    results.numberOfQueries = numberOfQueries;

    if (numberOfQueries >= 10) {
        trophies.push('queries_10');
    }
    if (numberOfQueries >= 100) {
        trophies.push('queries_100');
    }
    if (numberOfQueries >= 1000) {
        trophies.push('queries_1000');
    }

    return {
        trophies: trophies,
        results: results
    };
};


var toggleFavouriteTrophies = (_data) => {

    var trophies = [];
    var results  = {};

    /*
        check for number of favourites
    */

    var data = _.get(_data, '.favourite.toggle');

    if (!data) {
        return {
            trophies: trophies,
            results: results
        }
    }

    var numberOfFavourites = data.count;

    results.numberOfFavourites = numberOfFavourites;

    if (numberOfFavourites >= 10) {
        trophies.push('favourites_10');
    }
    if (numberOfFavourites >= 50) {
        trophies.push('favourites_50');
    }
    if (numberOfFavourites >= 100) {
        trophies.push('favourites_100');
    }

    return {
        trophies: trophies,
        results: results
    };
};

export var trophieFunctions = {
    favourite: {
        toggle: toggleFavouriteTrophies
    },
    queries: {
        add: addQuerieTrophies
    },
    vote: {
        up: voteUpTrophies,
        down: voteDownTrophies
    },
    auth: {
        login: authLoginTrophies
    }

};
