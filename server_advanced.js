// SSL Certificates
var fs = require('fs')

var options = {key:  fs.readFileSync('../certs/privatekey.pem').toString(),
			   cert: fs.readFileSync('../certs/certificate.pem').toString(),
			   ca:   [fs.readFileSync('../certs/certrequest.csr').toString()]}

var PORT_HANDSHAKE = 8001
var PORT_PROXY     = 8002

// Handshake server
var server = require('https').createServer(options).listen(PORT_HANDSHAKE);
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({server: server})

// Maximum number of connection to manage simultaneously before start clossing
var MAX_SOCKETS = 1024

//Array to store connections
wss.sockets = []
wss.sockets.find = function(socketId)
{
    for(var i = 0; i < wss.sockets.lenght; i++)
    {
        var socket = wss.sockets[i]
        if(socket.id == socketId)
            return socket
    }
}

wss.on('connection', function(socket)
{
    // Message received
    socket.onmessage = function(message)
    {
        var args = JSON.parse(message.data)

        var eventName = args[0]
        var socketId  = args[1]

        var soc = wss.sockets.find(socketId)
        if(soc)
        {
            if(eventName == 'connectTo')
            {
	            args[1] = socket.id

	            soc.send(JSON.stringify(args));
	        }
        }
        else
        {
            socket.send(JSON.stringify([eventName+'.error', socketId]));
            console.warn(eventName+': '+socket.id+' -> '+socketId);
        }
    }

    socket.onclose = function()
    {
        wss.sockets.splice(wss.sockets.IndexOf(socket), 1)
    }

    // Close the oldest socket if we are managing too much (we earn memory,
    // peer doesn't have to manage too much open connections and increage arity
    // of the network forcing new peers to use other ones)
    if(wss.sockets.length >= MAX_SOCKETS)
        wss.sockets[0].close()

    // Start managing the new socket
    socket.id = id()
    wss.sockets.push(socket)

    socket.send(JSON.stringify(['sessionId', socket.id]))
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
