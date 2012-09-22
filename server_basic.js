// SSL Certificates
var fs = require('fs');

var options = {key:  fs.readFileSync('../certs/privatekey.pem').toString(),
			   cert: fs.readFileSync('../certs/certificate.pem').toString(),
			   ca:   [fs.readFileSync('../certs/certrequest.csr').toString()]}

// P2P Stuff
var io = require('socket.io').listen(8001, options);
    io.set('log level', 2);

//var WebSocketServer = require('ws').Server
//var wss = new WebSocketServer({server: server})
//var wss = {}

////Array to store connections
//wss.sockets = {}

io.sockets.on('connection', function(socket)
//wss.on('connection', function(socket)
{
	socket.on('joiner', function(room)
	{
		var len = io.sockets.clients(room).length;

		if(len >= 2)
			socket.emit('joiner.error', 'room full');
		else
		{
			socket.join(room);
			socket.room = room;

			socket.emit('joiner.success');

			if(len == 1)
			{
				socket.peer = io.sockets.clients(room)[0];
	
				if(socket.peer != undefined)
				{
					// Set this socket as the other socket peer
					socket.peer.peer = socket;

					// Notify to both peers that we are now connected
					socket.emit('peer.connected', socket.id);
					socket.peer.emit('peer.connected', socket.id);
				}
			}
		}
	});

	socket.on('disconnect', function()
	{
        if(socket.peer != undefined)
        {
	   	    socket.peer.emit('peer.disconnected');

			socket.peer.peer = undefined;
		}
	});

	// Proxied events

    function onmessage(message)
    {
		if(socket.peer != undefined)
			socket.peer.send(message);
    }

    // Detect how to add the EventListener (mainly for Socket.io since don't
    // follow the W3C WebSocket/DataChannel API)
    if(socket.on)
        socket.on('message', onmessage);
    else
        socket.onmessage = onmessage;
});
