# @gamestdio/websocket

WebSocket with reconnect back-off feature.

For Node.js support, you should install the `ws` module in your project.

## Usage

`WebSocketClient` behaves exactly in the same way as `WebSocket`.

It accepts an optional third parameter, which is used to configure
[backoff](https://github.com/MathieuTurcotte/node-backoff) feature.

```javascript
// fibonacci backoff strategy
var conn = new WebSocketClient('ws://' + host + ':8080', null, {
  backoff: "fibonacci"
});
```

```javascript
// exponential backoff strategy
var conn = new WebSocketClient('ws://' + host + ':8080', null, {
  backoff: "exponential"
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
