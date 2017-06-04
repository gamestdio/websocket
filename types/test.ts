///<reference path="index.d.ts"/>
import WebSocketClient from "websocket.js";
let wsClient = new WebSocketClient("ws://...");
wsClient.onreconnect = () => {};
wsClient.onopen = () => {};
wsClient.onclose = () => {};
wsClient.onmessage = () => {};
