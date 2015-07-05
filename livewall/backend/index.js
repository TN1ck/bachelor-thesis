var express    = require('express');
var bodyParser = require('body-parser');
var Promise    = require('bluebird');
var cors       = require('cors');
var http       = require('http');
var _          = require('lodash');

var models     = require('./models');
var User       = models.User;
var Action     = models.Action;
var Vote       = models.Vote;
var Item       = models.Item;

var app        = express();
var port       = 4000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//
// ROUTES
//

var router = express.Router();

router.post('/user/action', cors(), require('./api/user/action.js'));
router.post('/user/vote',   cors(), require('./api/user/vote.js'));

router.get('/items',        cors(), require('./api/items/items.js'));
router.get('/points',       cors(), require('./api/points/points.js'));

router.get('/actions',      cors(), require('./api/actions/actions.js'));

app.use('/api', router);

app.listen(port);
