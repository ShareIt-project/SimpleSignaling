// SSL Certificates
var fs = require('fs');

var options = {key:  fs.readFileSync('certs/privatekey.pem').toString(),
			   cert: fs.readFileSync('certs/certificate.pem').toString(),
			   ca:  [fs.readFileSync('certs/certrequest.csr').toString()]};

// Get AppFog port, or set 8080 as default one (dotCloud mandatory)
var port = process.env.VMC_APP_PORT || 8080;

console.log( "Starting server on port " + port )

// HTTP server
function requestListener(req, res)
{
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('This is a SimpleSignaling handshake server. You can get a copy ');
  res.write('of the source code at ');
  res.end  ('<a href="//github.com/ShareIt-project/SimpleSignaling">GitHub</a>');
}

var server = require('http').createServer(requestListener);
//var server = require('https').createServer(options, requestListener);
server.listen(port);

// Handshake server
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: server});

// Maximum number of connection to manage simultaneously before start closing
var MAX_PENDING_SOCKETS = 64;
var MAX_SOCKETS = 1024;

//Array to store connections (we want to remove them later on insertion order)
wss.pending_sockets = [];
wss.sockets = [];
wss.rooms = {};

/**
 * Find a socket on the sockets list based on its uid
 * @param {Array} sockets Array of sockets
 * @param {String} uid Identifier of the socket
 * @returns {Socket|undefined}
 */
function find(sockets, uid)
{
    for(var i=0, socket; socket = sockets[i]; i++)
    {
        if(socket.uid == uid)
            return socket;
    }
}

wss.on('connection', function(socket)
{
    // Message received
    socket.onmessage = function(message)
    {
        message = JSON.parse(message.data);

        var dest = message[0];
        var room = message[1];

        var soc = find(wss.sockets, dest);

        // UID registration
        if(message.length == 2)
        {
            // Check if we are trying to use a yet registered UID
            if(soc)
            {
                // It's the same socket, update the UID
                if(socket == soc)
                    socket.uid = dest;

                // Trying to set the UID of a different socket, raise error
                else
                {
//                  socket.send(JSON.stringify([uid, 'Yet registered']));
                    console.warn(dest+' is yet registered');
                }
            }

            // Socket want to register for the first time
            else
            {
                // Close the oldest sockets if we are managing too much
                // (we earn some memory)
                while(wss.sockets.length >= MAX_SOCKETS)
                    wss.sockets[0].close();

                // Set the socket UID
                socket.uid = dest;

                // Start managing the new socket
                var index = wss.pending_sockets.indexOf(socket);
                wss.pending_sockets.splice(index, 1);
                wss.sockets.push(socket);

//                console.log("Registered "+socket.uid);
            }
        }

        // Forward message
        else if(soc)
        {
            message[0] = socket.uid;

            soc.send(JSON.stringify(message));
        }

        // UID not defined, send by broadcast
        else if(!dest)
        {
            message[0] = socket.uid;

            for(var i=0, soc; soc=wss.sockets[i]; i++)
                soc.send(JSON.stringify(message));
        }

        // Trying to send a message to a non-connected peer, raise error
        else
        {
//            socket.send(JSON.stringify([dest, 'Not connected']));
            console.warn(socket.uid+' -> '+dest);
        }
    };

    /**
     * Remove the socket from the list of sockets and pending_sockets
     */
    socket.onclose = function()
    {
        wss.pending_sockets.splice(wss.pending_sockets.indexOf(socket), 1);
        wss.sockets.splice(wss.sockets.indexOf(socket), 1);
    };

    // Close the oldest pending sockets if we are managing too much (we earn
    // memory)
    while(wss.pending_sockets.length >= MAX_PENDING_SOCKETS)
        wss.pending_sockets[0].close();

    // Set the new socket as pending
    wss.pending_sockets.push(socket);
});
