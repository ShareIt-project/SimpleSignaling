// SSL Certificates
var fs = require('fs');

var options = {key:  fs.readFileSync('certs/privatekey.pem').toString(),
			   cert: fs.readFileSync('certs/certificate.pem').toString(),
			   ca:  [fs.readFileSync('certs/certrequest.csr').toString()]};

// Get AppFog port, or set 8001 as default one
var port = process.env.VMC_APP_PORT || 8001;

// HTTP server
function requestListener(req, res)
{
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('This is a SimpleSignaling handshake server. You can get a copy ');
  res.write('of the source code at ');
  res.end  ('<a href="https://github.com/piranna/SimpleSignaling">GitHub</a>');
}

var server = require('http').createServer(requestListener);
//var server = require('https').createServer(options, requestListener);
    server.listen(port);

// Handshake server
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: server});

// Maximum number of connection to manage simultaneously before start clossing
var MAX_SOCKETS = 1024;

//Array to store connections (we want to remove them later on insertion order)
wss.sockets = [];

function find(sockets, socketId)
{
    for(var i=0, socket; socket = sockets[i]; i++)
    {
        if(socket.id == socketId)
            return socket;
    }
}

wss.on('connection', function(socket)
{
    // Message received
    socket.onmessage = function(message)
    {
        message = JSON.parse(message.data);

        var uid = message[0];

        var soc = find(wss.sockets, uid);
        if(soc)
        {
            message[1] = socket.id;

            soc.send(JSON.stringify(message));
        }
        else
        {
//            socket.send(JSON.stringify([eventName+'.error', uid]));
            console.warn(socket.id+' -> '+uid);
        }
    };

    socket.onclose = function()
    {
        wss.sockets.splice(wss.sockets.indexOf(socket), 1);
    };

    // Close the oldest sockets if we are managing too much (we earn memory,
    // peer doesn't have to manage too much open connections and increage arity
    // of the network forcing new peers to use other ones)
    while(wss.sockets.length >= MAX_SOCKETS)
        wss.sockets[0].close();

    // Start managing the new socket
    socket.id = id();
    wss.sockets.push(socket);

    socket.send(JSON.stringify(['sessionId', socket.id]));
//    console.log("Connected socket.id: "+socket.id);
});


// generate a 4 digit hex code randomly
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// make a REALLY COMPLICATED AND RANDOM id, kudos to dennis
function id() {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}