requirejs.config({
    baseUrl: '/bower_components',
    paths: {
        jquery: 'jquery/dist/jquery',
        react: 'react/react',
        lodash: 'lodash/lodash',
        cookies: 'Cookies/dist/cookies',
        store: 'store.js/store'
    }
});

// Load the main app module to start the app
require(["/dist/scripts/main.js"])