/**
 * Client of the SimpleSignaling protocol
 * @constructor
 * @param {Object} configuration Configuration of the connection
 */
function SimpleSignaling(configuration)
{
    var self = this;

    var websocket = new WebSocket(configuration.ws_uri);
        websocket.onopen = function()
        {
            // Message received
            websocket.onmessage = function(message)
            {
                message = JSON.parse(message.data);

                var orig = message[0];
                var data = message[1];

                if(self.onmessage)
                   self.onmessage(data, orig);
            };

            // Send our UID
            websocket.send(JSON.stringify([configuration.uid]));

            // Set signaling as open
            if(self.onopen)
                self.onopen(configuration.uid);
        };

    /**
     * Compose and send message
     * @param message Data to be send
     * @param {String|undefined} uid Identifier of the remote peer. If null,
     * message is send by broadcast to all connected peers
     */
    this.send = function(message, dest)
    {
        websocket.send(JSON.stringify([dest, message]), function(error)
        {
            if(error && self.onerror)
                self.onerror(error);
        });
    };
}