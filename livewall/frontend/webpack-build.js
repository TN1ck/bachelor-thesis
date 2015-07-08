var webpack          = require('webpack');
var config           = require('./webpack.config.prod.js');

webpack(config, function (err, stats) {
    console.log('woot');
    if (err) {
        console.error(err);
    }
    console.log(stats);
});
