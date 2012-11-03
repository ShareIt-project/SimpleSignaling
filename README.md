# ShareIt! - Pure Javascript Peer to Peer filesharing

Jesús Leganés Combarro "Piranna" - [piranna@gmail.com]

Based on code from Rich Jones - rich@[gun.io](http://gun.io)

ShareIt! is a "Peer to Peer" filesharing system written in pure Javascript and
based on the [DirtyShare](https://github.com/Miserlou/DirtyShare)
proof-of-concept by Rich Jones.

If you will fork the project (and more if you want to do modifications) please
send me an email to let me know :-)

## About

File transfers in ShareIt! happen from a host client to a peer client, in chunks
which go through the webserver over WebSockets provided by Socket.IO like a
proxy, and in the future directly thanks to WebRTC PeerConnection DataChannels.
The web server only holds onto the data while it is being received and
transmitted through it, so there is no data ever permanently stored on the web
server. This makes it perfect for anonymity.

Ideally, the WebSockets will only be used to establish the P2P connections which
will go over the HTML5 PeerConnection object, however, no modern browsers
support this feature yet. Hopefully, it will become available within the last
quarter of 2012 or so, and we will be ready for it from the start.

Let's make a purely browser based, ad-free, Free and Open Source private and
anonymous filesharing system!

## Future progress

* Adapt protocol to connection + function, more in the way DataChannel will work
* Integrate Javascript from 'html' and 'html_advance' folders to create a new
  WebP2P framework

## Mailing List

If you'd like to discuss P2P web applications further, send an email to 

> webp2p@librelist.com

and you'll be part of the discussion mailing list!
[(Archives here.)](http://librelist.com/browser/webp2p/)

## How to test it

Currently, the web app static files on the 'html' folder can be served by a
regular web server. For example, if you have Python installed they can be served
directly from the folder using

> python -m SimpleHTTPServer 8000

so the web server will be available on http://localhost:8000.

The peer connections are managed by a socket.io proxy build on Node.js, so
you'll need to have installed Node.js and the module 'socket.io' (you can
install it with the Node.js 'npm' tool). Later, you can be able to launch it
just writting on a terminal

> node connect_websockets.js

and the socket.io proxy will be running on http://localhost:8001.

Regarding to the browser, you will need Firefox v14 or Internet Explorer 10
(Chrome/Chromium will be available when is fixed a bug related to
[storing File object references on IndexedDB](http://code.google.com/p/chromium/issues/detail?id=108012),
luckily on [September](http://en.wikipedia.org/wiki/September_(singer)) - pun
intended ;-) ). Because the IndexedDB is common accesed by all the browser tabs,
to test it locally on the same machine instead of with two computers/browsers/virtual machines
you can do it with Firefox launching two instances each one with it's own
profile. You can be able to do it with 'firefox -P -no-remote' to show the
Firefox ProfileManager and force to create a new full instance instead of open a
new browser on the current running up.

## TODO

* Work on doing proper PeerConnection based transfers when builds are available.
* Clean it up. It's a little dirty.
* Send as little data as possible.
* Find the optimal size for chunking. Currently set at 64Kb - this is arbitrary.
* Security, of any kind.
* Drag and drop of files, so my roommate shuts up about it.

## License

All this code is under the Affero GNU General Public License. Regarding to the
core of the application at js/webp2p (that I'll distribute as an independent
library/framework some date in the future) I am willing to relicense it under
the BSD/MIT/Apache license, I simply ask that you email me and tell me why. I'll
almost certainly agree.

Patches graciously accepted!
