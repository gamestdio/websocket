const assert = require('assert');
const WebSocketClient =  require('../lib/index').default;

describe("WebSocketClient", () => {

  it("should connect to echo server", (done) => {
    const ws = new WebSocketClient("wss://echo.websocket.org");

    ws.onmessage = function(msg) {
      assert.equal(msg.data, "Hello world!");
      ws.close();
    }

    ws.onopen = function() {
      assert.ok("should open WebSocket connection");
      ws.send("Hello world!");
    }

    ws.onclose = function() {
      done();
    }
  });

});
