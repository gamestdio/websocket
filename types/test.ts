///<reference path="index.d.ts"/>
import WebSocketClient from "@gamestdio/websocket";
let wsClient = new WebSocketClient("ws://...");
wsClient.onreconnect = () => {};
wsClient.onopen = () => {};
wsClient.onclose = () => {};
wsClient.onmessage = () => {};

class MyClient extends WebSocketClient {
    onMessageCallback (event) {
        super.onMessageCallback();
    }
}
