var io         = require('socket.io')();

//
// WEBSOCKET
//

io.on('connection', function(socket){
        console.log('new socket connection');
        socket.on('event', function(data){});
        socket.on('disconnect', function(){});
});

module.exports = io;
