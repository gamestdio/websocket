declare module "websocket.js" {
    interface WebSocketConnectionOptions {
        strategy?: "fibonacci" | "exponential",
        randomisationFactor?: number,
        initialDelay?: number,
        maxDelay?: number,
        factor?: number
    }

    class WebSocketClient extends WebSocket {
        constructor (url: string, protocols?: string[], options?: WebSocketConnectionOptions);
        url: string;
        protocols?: string[];

        ws: WebSocket;
        binaryType: string;
        send(data: any): void;
        listeners: {[id: string]: Function};

        onreconnect: (this: WebSocketClient, ev: Event) => any;

        onCloseCallback (event?: Event): void;
        onErrorCallback (event?: Event): void;
        onMessageCallback (event?: Event): void;
        onOpenCallback (event?: Event): void;
    }

    export default WebSocketClient;
}
