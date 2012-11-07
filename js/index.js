function Transport_init(transport)
{
    EventTarget.call(transport)

    // Compose and send message
    transport.emit = function(uid, data)
    {
        transport.send(JSON.stringify([uid, data]), function(error)
        {
            if(error)
                console.warning(error);
        });
    }

    // Message received
    transport.onmessage = function(message)
    {
        message = JSON.parse(message.data)

        var event = {'uid': message[0], 'data': message[1]}

        transport.dispatchEvent(event)
    }
}