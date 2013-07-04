# SimpleSignaling - Simple signaling protocol over WebSockets

Jesús Leganés Combarro "Piranna" - [piranna@gmail.com]

SimpleSignaling is a simple and minimalistic signaling protocol using WebSockets
and developed originally for the [ShareIt!](https://github.com/piranna/ShareIt)
project. It is highly indicate for [WebRTC](http://www.webrtc.org) applications.

If you will fork the project (and more if you want to do modifications) please
send me an email to let me know :-)

## How to use it

You just need to use simpleSignaling.js on the client and deploy a backend
server.js on a node.js enabled machine with WebSockets. It's recomended it also
has SSL.

There's also a (public) SSL enabled backend server that you can use at
wss://simplesignaling-piranna.dotcloud.com. Just for testing purposes please,
the bandwidth is high, but not infinite... :-)

## API

    var server = new SimpleSignaling( {
      // The SimpleSignaling server
      ws_uri: 'ws://ec2-54-242-188-68.compute-1.amazonaws.com:8080',
      room: 'broadcast-test', // Optional, not really used in this example
      uid: 'user identifier' // Optional, a [UUIDv4](//en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29) will be generated
    } )
    
    server.onopen = function() {}
    server.onmessage = function( message, source, room ) {}
    server.onerror = function( error ) {}
    
    server.send( message, uid, room )
    
    server.uid() // Returns UID
    server.room() // Returns room

## Running on [Ubuntu](//www.ubuntu.com/)

* `sudo apt-get install git nodejs npm`
* `git clone http://github.com/wholcomb/SimpleSignaling`
* `npm install ws`
* `./SimpleSignaling/bin/run_server`

## License

This code is under the Affero GNU General Public License. I am willing to
relicense it under the BSD/MIT/Apache license, I simply ask that you email me
and tell me why. I'll almost certainly agree.

Patches graciously accepted!
