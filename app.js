// SSL Certificates
var fs = require('fs');

var options = {key:  fs.readFileSync('certs/privatekey.pem').toString(),
			   cert: fs.readFileSync('certs/certificate.pem').toString(),
			   ca:   [fs.readFileSync('certs/certrequest.csr').toString()]}

// P2P Stuff
var server = require('https').createServer(options).listen(8001);
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({server: server})
//var io = require('socket.io').listen({port: 8001});
//    io.set('log level', 2);

//Array to store connections
wss.sockets = {}

//io.sockets.on('connection', function(socket)
wss.on('connection', function(socket)
{
    socket._emit = function()
    {
        var args = Array.prototype.slice.call(arguments, 0);

        socket.send(JSON.stringify(args), function(error)
        {
            if(error)
                console.log(error);
        });
    }

    // Message received
    function onmessage(message)
    {
        console.log("socket.onmessage = '"+message+"'")
        var args = JSON.parse(message)

        var eventName = args[0]
        var socketId  = args[1]

//        var soc = io.sockets.sockets[socketId]
        var soc = wss.sockets[socketId]
        if(soc)
        {
            args[1] = socket.id

            soc._emit.apply(soc, args);
        }
        else
        {
            socket._emit(eventName+'.error', socketId);
            console.warn(eventName+': '+socket.id+' -> '+socketId);
        }
    }

    // Detect how to add the EventListener (mainly for Socket.io since don't
    // follow the W3C WebSocket/DataChannel API)
    if(socket.on)
        socket.on('message', onmessage);
    else
        socket.onmessage = function(message){onmessage(message.data)};

    // Set and register a sockedId if it was not set previously
    // Mainly for WebSockets server
    if(socket.id == undefined)
    {
        socket.id = id()
        wss.sockets[socket.id] = socket
    }

    socket._emit('sessionId', socket.id)
    console.log("Connected socket.id: "+socket.id)
})

// generate a 4 digit hex code randomly
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// make a REALLY COMPLICATED AND RANDOM id, kudos to dennis
function id() {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
