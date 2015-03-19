requirejs.config({
    baseUrl: '/bower_components',
    paths: {
        jquery: 'jquery/dist/jquery',
        react: 'react/react-with-addons',
        lodash: 'lodash/lodash',
        cookies: 'Cookies/dist/cookies',
        store: 'store.js/store',
        fluxxor: 'fluxxor/build/fluxxor',
        reflux: 'reflux/dist/reflux',
        immutable: 'immutable/dist/immutable'
    }
});

// Load the main app module to start the app
require(["/dist/scripts/main.js"])