var io         = require('socket.io')();
var ioPort     = 4001;

//
// WEBSOCKET
//

io.on('connection', function(socket){
        console.log('new socket connection');
        socket.on('event', function(data){});
        socket.on('disconnect', function(){});
});

io.listen(ioPort);

module.exports = io;
