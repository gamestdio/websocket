declare module "websocket.js" {
    interface WebSocketConnectionOptions {
        strategy?: "fibonacci" | "exponential",
        randomisationFactor?: number,
        initialDelay?: number,
        maxDelay?: number,
        factor?: number
    }

    class WebSocketClient {
        constructor (url: string, protocols?: string[], options?: WebSocketConnectionOptions);
        url: string;
        protocols?: string[];

        ws: WebSocket;
        binaryType: string;
        send(data: any): void;
        listeners: {[id: string]: Function};

        onclose: Function;
        onerror: Function;
        onmessage: Function;
        onopen: Function;
        onreconnect: Function;

    }

    export default WebSocketClient;
}
