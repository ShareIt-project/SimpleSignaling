function SimpleSignaling(configuration)
{
    var self = this;

    var websocket = WebSocket(configuration.ws_uri)

    // Compose and send message
    this.emit = function(uid, data)
    {
        websocket.send(JSON.stringify([uid, data]), function(error)
        {
            if(error)
                console.warning(error);
        });
    }

    // Message received
    websocket.onmessage = function(message)
    {
        message = JSON.parse(message.data);

        var uid  = message[0];
        var data = message[1];

        if(self.onmessage)
           self.onmessage(uid, data);
    };
}