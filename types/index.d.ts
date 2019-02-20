declare module "@gamestdio/websocket" {
    interface WebSocketConnectionOptions {
        backoff?: "fibonacci" | "exponential",
        initialDelay?: number,
        maxDelay?: number,
        connect?: boolean
    }

    class WebSocketClient extends WebSocket {
        constructor (url: string, protocols?: string[], options?: WebSocketConnectionOptions);

        // properties
        url: string;
        protocols?: string[];
        reconnectEnabled: boolean;

        ws: WebSocket;
        binaryType: BinaryType;
        listeners: {[id: string]: Function};

        // methods
        send(data: any): void;
        open(reconnect?: boolean): void;

        //callbacks
        onreconnect: (this: WebSocketClient, ev: Event) => any;
        onCloseCallback (event?: CloseEvent): void;
        onErrorCallback (event?: Event): void;
        onMessageCallback (event?: MessageEvent): void;
        onOpenCallback (event?: Event): void;
    }

    export default WebSocketClient;
}
