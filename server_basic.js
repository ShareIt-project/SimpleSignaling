// SSL Certificates
var fs = require('fs');

var options = {key:  fs.readFileSync('certs/privatekey.pem').toString(),
			   cert: fs.readFileSync('certs/certificate.pem').toString(),
			   ca:   [fs.readFileSync('certs/certrequest.csr').toString()]}

// Get AppFog port, or set 8001 as default one
var port = process.env.VMC_APP_PORT || 8001

// HTTP server
function requestListener(req, res)
{
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('This is a ShareIt! handshake server. You can get a copy of the ')
  res.end('source code at <a href="https://github.com/piranna/ShareIt">GitHub</a>')
}

var server = require('http').createServer(requestListener)
//var server = require('https').createServer(options, requestListener)
    server.listen(port);

// Handshake server
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({server: server})

// Dict to store rooms
wss.rooms = {}

wss.on('connection', function(socket)
{
    socket.onmessage = function(message)
    {
        var args = JSON.parse(message.data)

        var eventName = args[0]
        var roomId    = args[1]

        var room = wss.rooms[roomId]
        if(!room)
        {
            room = wss.rooms[roomId] = []
            room.id = roomId
        }

        var len = room.length

        if(len >= 2)
            socket.send(JSON.stringify(['joiner.error', 'room full']))
        else
        {
            room.append(socket)
            socket.room = room;

            socket.send(JSON.stringify(['joiner.success']));

            if(len == 1)
            {
                socket.peer = room[0];

                if(socket.peer != undefined)
                {
                    // Set this socket as the other socket peer
                    socket.peer.peer = socket;

                    // Notify to both peers that we are now connected
                    socket.send(JSON.stringify(['peer.connected', socket.id]))
                    socket.peer.send(JSON.stringify(['peer.connected', socket.id]))
                }
            }
        }
    }

	socket.onclose = function()
	{
        if(socket.peer != undefined)
        {
	   	    socket.peer.send(JSON.stringify(['peer.disconnected']));

			socket.peer.peer = undefined;
		}

        var roomId = socket.room.id

        rooms.splice(rooms.IndexOf(socket), 1)

        if(!rooms[roomId].lenght)
            delete rooms[roomId]
	}
})