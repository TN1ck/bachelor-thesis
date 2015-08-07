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

var port        = 4000;
var app         = express();
var server      = http.createServer(app);
io.listen(server);


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//
// ROUTES
//

var router = express.Router();

router.post('/user/action',  cors(), require('./api/user/action.js'));
router.post('/user/vote',    cors(), require('./api/user/vote.js'));
router.post('/user/booster', cors(), require('./api/user/booster.js'));

router.get('/items',         cors(), require('./api/items/items.js'));
router.get('/points',        cors(), require('./api/points/points.js'));

router.get('/actions',       cors(), require('./api/actions/actions.js'));

app.use('/api', router);
app.use(compression());
app.use(express.static('../frontend/dist'))

server.listen(port);
