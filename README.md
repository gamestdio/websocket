# websocket.js

WebSocket browser client with reconnect back-off feature.

## Usage

`WebSocketClient` behaves exactly in the same way as `WebSocket`.

It accepts an optional third parameter, which is used to configure
[backoff](https://github.com/MathieuTurcotte/node-backoff) feature.

```javascript
// fibonacci backoff strategy
var conn = new WebSocketClient('ws://' + host + ':8080', null, {
  strategy: "fibonacci",
  randomisationFactor: 0, // defaults to 0, must be between 0 and 1
  initialDelay: 10,       // defaults to 100 ms
  maxDelay: 300           // defaults to 10000 ms
});
```

```javascript
// exponential backoff strategy
var conn = new WebSocketClient('ws://' + host + ':8080', null, {
  strategy: "exponential",
  randomisationFactor: 0, // defaults to 0, must be between 0 and 1
  initialDelay: 10,       // defaults to 100 ms
  maxDelay: 300,          // defaults to 10000 ms
  factor: 3               // defaults to 2, must be greater than 1
});
```

## Event Listeners

- onclose
- onerror
- onmessage
- onopen
- onreconnect

## License

MIT
