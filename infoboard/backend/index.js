var express     = require('express');
var bodyParser  = require('body-parser');
var compression = require('compression')
var Promise     = require('bluebird');
var cors        = require('cors');
var http        = require('http');
var _           = require('lodash');

var models      = require('./models');
var User        = models.User;
var Action      = models.Action;
var Vote        = models.Vote;
var Item        = models.Item;

var io          = require('./api/socket.js');

// create the server

var port        = parseInt(process.env.PORT, 10) || 4000;
var app         = express();
var server      = http.createServer(app);

// the websocket listens on the same port
io.listen(server);

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//
// ROUTES
//

var router = express.Router();

router.post('/user/action',  cors(), require('./api/user/action.js'));
router.post('/user/vote',    cors(), require('./api/user/vote.js'));
router.post('/user/booster', cors(), require('./api/user/booster.js'));

router.post('/items',        cors(), require('./api/items/items.js'));

router.get('/points',        cors(), require('./api/points/points.js'));
router.get('/activities',    cors(), require('./api/activities/activities.js'));

// make the routes available under /api
app.use('/api', router);
// activate compression
app.use(compression());
// host the static frontend-files via express
app.use(express.static('../frontend/dist'))


// listen for requests
server.listen(port);
