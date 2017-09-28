# @gamestdio/websocket

WebSocket browser client with reconnect back-off feature.

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
