function SimpleSignaling(configuration)
{
    var self = this;

    var websocket = new WebSocket(configuration.ws_uri);
        websocket.open = function()
        {
            // Message received
            websocket.onmessage = function(message)
            {
                message = JSON.parse(message.data);

                var uid  = message[0];
                var data = message[1];

                if(self.onmessage)
                   self.onmessage(uid, data);
            };

            // Send our UID
            websocket.send(JSON.stringify([configuration.uid]));

            // Set signaling as open
            if(self.onopen)
                self.onopen(configuration.uid);
        };

    // Compose and send message
    this.send = function(uid, data)
    {
        websocket.send(JSON.stringify([uid, data]), function(error)
        {
            if(error && self.onerror)
                self.onerror(error);
        });
    };
}