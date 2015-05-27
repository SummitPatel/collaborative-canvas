# A Simultaneous Drawing Application

## Setup

* Clone this repository on to your local machine.

* Run `npm install` to get the Socket.io and Express dependencies.

## Feautures

* The client accepts mouse input, and draws a line when the user clicks and drags on the canvas.

* All clients see the same image at all times.

* If a new client connects, the existing image is sent to them.

* If a client presses the `esc` key, the current image is cleared for all clients, and all server image history is erased.

* If a client disconnects, all of the lines drawn by that client are removed.

* If a client presses the `s` key, all lines that they have drawn up until that point are saved, and should not be removed when they disconnect. Any lines drawn by them *after* they saved should still be removed when they disconnect.

* The server state does not persist if the server is restarted.

## Documentation

### Node.js
* Simple server example: [https://nodejs.org/](https://nodejs.org/)
* `fs` module documentation, for loading files: [https://nodejs.org/](https://nodejs.org/api/fs.html)
* `http` module documentation, for creating a server: [https://nodejs.org/](https://nodejs.org/api/http.html)

### Socket.io
* Chat client example: [https://github.com/Automattic/socket.io/tree/master/examples/chat](https://github.com/Automattic/socket.io/tree/master/examples/chat)
* Server API documentation: [http://socket.io/docs/server-api/](http://socket.io/docs/server-api/)
* Client API documentation: [http://socket.io/docs/client-api/](http://socket.io/docs/client-api/)

### Canvas
* Basic usage tutorial: [https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage)
* `lineTo` documentation: [https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo)
* `fillRect` documentation: [https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect)
