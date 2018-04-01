declare module "@gamestdio/websocket" {
    interface WebSocketConnectionOptions {
        backoff?: "fibonacci" | "exponential",
        initialDelay?: number,
        maxDelay?: number,
    }

    class WebSocketClient extends WebSocket {
        constructor (url: string, protocols?: string[], options?: WebSocketConnectionOptions);
        url: string;
        protocols?: string[];
        reconnectEnabled: boolean;

        ws: WebSocket;
        binaryType: BinaryType;
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
