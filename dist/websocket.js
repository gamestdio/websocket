(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.WebSocketClient = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBackoff = createBackoff;
var backoff = {
  exponential: function exponential(attempt, delay) {
    return Math.floor(Math.random() * Math.pow(2, attempt) * delay);
  },
  fibonacci: function fibonacci(attempt, delay) {
    var current = 1;

    if (attempt > current) {

      var prev = 1,
          current = 2;

      for (var index = 2; index < attempt; index++) {
        var next = prev + current;
        prev = current;
        current = next;
      }
    }

    return Math.floor(Math.random() * current * delay);
  }
};

function createBackoff(type, options) {
  return new Backoff(backoff[type], options);
}

function Backoff(func, options) {
  this.func = func;
  this.attempts = 0;
  this.delay = typeof options.initialDelay !== "undefined" ? options.initialDelay : 100;
}

Backoff.prototype.backoff = function () {
  setTimeout(this.onReady, this.func(++this.attempts, this.delay));
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var createBackoff = require('./backoff').createBackoff;

var WebSocketClient = function () {

  /**
   * @param url DOMString The URL to which to connect; this should be the URL to which the WebSocket server will respond.
   * @param protocols DOMString|DOMString[] Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified protocol). If you don't specify a protocol string, an empty string is assumed.
   */
  function WebSocketClient(url, protocols) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, WebSocketClient);

    this.url = url;
    this.protocols = protocols;

    this.reconnectEnabled = true;
    this.listeners = {};

    this.backoff = createBackoff(options.backoff || 'exponential', options);
    this.backoff.onReady = this.onBackoffReady.bind(this);

    if (typeof options.connect === "undefined" || options.connect) {
      this.open();
    }
  }

  _createClass(WebSocketClient, [{
    key: 'open',
    value: function open() {
      var reconnect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this.isReconnect = reconnect;

      // keep binaryType used on previous WebSocket connection
      var binaryType = this.ws && this.ws.binaryType;

      this.ws = new WebSocket(this.url, this.protocols);
      this.ws.onclose = this.onCloseCallback.bind(this);
      this.ws.onerror = this.onErrorCallback.bind(this);
      this.ws.onmessage = this.onMessageCallback.bind(this);
      this.ws.onopen = this.onOpenCallback.bind(this);

      if (binaryType) {
        this.ws.binaryType = binaryType;
      }
    }

    /**
     * @ignore
     */

  }, {
    key: 'onBackoffReady',
    value: function onBackoffReady(number, delay) {
      // console.log("onBackoffReady", number + ' ' + delay + 'ms');
      this.open(true);
    }

    /**
     * @ignore
     */

  }, {
    key: 'onCloseCallback',
    value: function onCloseCallback(e) {
      if (!this.isReconnect && this.listeners['onclose']) {
        this.listeners['onclose'].apply(null, arguments);
      }
      if (this.reconnectEnabled && e.code < 3000) {
        this.backoff.backoff();
      }
    }

    /**
     * @ignore
     */

  }, {
    key: 'onErrorCallback',
    value: function onErrorCallback() {
      if (this.listeners['onerror']) {
        this.listeners['onerror'].apply(null, arguments);
      }
    }

    /**
     * @ignore
     */

  }, {
    key: 'onMessageCallback',
    value: function onMessageCallback() {
      if (this.listeners['onmessage']) {
        this.listeners['onmessage'].apply(null, arguments);
      }
    }

    /**
     * @ignore
     */

  }, {
    key: 'onOpenCallback',
    value: function onOpenCallback() {
      if (this.listeners['onopen']) {
        this.listeners['onopen'].apply(null, arguments);
      }

      if (this.isReconnect && this.listeners['onreconnect']) {
        this.listeners['onreconnect'].apply(null, arguments);
      }

      this.isReconnect = false;
    }

    /**
     * The number of bytes of data that have been queued using calls to send()
     * but not yet transmitted to the network. This value does not reset to zero
     * when the connection is closed; if you keep calling send(), this will
     * continue to climb.
     *
     * @type unsigned long
     * @readonly
     */

  }, {
    key: 'close',


    /**
     * Closes the WebSocket connection or connection attempt, if any. If the
     * connection is already CLOSED, this method does nothing.
     *
     * @param code A numeric value indicating the status code explaining why the connection is being closed. If this parameter is not specified, a default value of 1000 (indicating a normal "transaction complete" closure) is assumed. See the list of status codes on the CloseEvent page for permitted values.
     * @param reason A human-readable string explaining why the connection is closing. This string must be no longer than 123 bytes of UTF-8 text (not characters).
     *
     * @return void
     */
    value: function close(code, reason) {
      if (typeof code == 'undefined') {
        code = 1000;
      }

      this.reconnectEnabled = false;

      this.ws.close(code, reason);
    }

    /**
     * Transmits data to the server over the WebSocket connection.
     * @param data DOMString|ArrayBuffer|Blob
     * @return void
     */

  }, {
    key: 'send',
    value: function send(data) {
      this.ws.send(data);
    }

    /**
     * An event listener to be called when the WebSocket connection's readyState changes to CLOSED. The listener receives a CloseEvent named "close".
     * @param listener EventListener
     */

  }, {
    key: 'bufferedAmount',
    get: function get() {
      return this.ws.bufferedAmount;
    }

    /**
     * The current state of the connection; this is one of the Ready state constants.
     * @type unsigned short
     * @readonly
     */

  }, {
    key: 'readyState',
    get: function get() {
      return this.ws.readyState;
    }

    /**
     * A string indicating the type of binary data being transmitted by the
     * connection. This should be either "blob" if DOM Blob objects are being
     * used or "arraybuffer" if ArrayBuffer objects are being used.
     * @type DOMString
     */

  }, {
    key: 'binaryType',
    get: function get() {
      return this.ws.binaryType;
    },
    set: function set(binaryType) {
      this.ws.binaryType = binaryType;
    }

    /**
     * The extensions selected by the server. This is currently only the empty
     * string or a list of extensions as negotiated by the connection.
     * @type DOMString
     */

  }, {
    key: 'extensions',
    get: function get() {
      return this.ws.extensions;
    },
    set: function set(extensions) {
      this.ws.extensions = extensions;
    }

    /**
     * A string indicating the name of the sub-protocol the server selected;
     * this will be one of the strings specified in the protocols parameter when
     * creating the WebSocket object.
     * @type DOMString
     */

  }, {
    key: 'protocol',
    get: function get() {
      return this.ws.protocol;
    },
    set: function set(protocol) {
      this.ws.protocol = protocol;
    }
  }, {
    key: 'onclose',
    set: function set(listener) {
      this.listeners['onclose'] = listener;
    },
    get: function get() {
      return this.listeners['onclose'];
    }

    /**
     * An event listener to be called when an error occurs. This is a simple event named "error".
     * @param listener EventListener
     */

  }, {
    key: 'onerror',
    set: function set(listener) {
      this.listeners['onerror'] = listener;
    },
    get: function get() {
      return this.listeners['onerror'];
    }

    /**
     * An event listener to be called when a message is received from the server. The listener receives a MessageEvent named "message".
     * @param listener EventListener
     */

  }, {
    key: 'onmessage',
    set: function set(listener) {
      this.listeners['onmessage'] = listener;
    },
    get: function get() {
      return this.listeners['onmessage'];
    }

    /**
     * An event listener to be called when the WebSocket connection's readyState changes to OPEN; this indicates that the connection is ready to send and receive data. The event is a simple one with the name "open".
     * @param listener EventListener
     */

  }, {
    key: 'onopen',
    set: function set(listener) {
      this.listeners['onopen'] = listener;
    },
    get: function get() {
      return this.listeners['onopen'];
    }

    /**
     * @param listener EventListener
     */

  }, {
    key: 'onreconnect',
    set: function set(listener) {
      this.listeners['onreconnect'] = listener;
    },
    get: function get() {
      return this.listeners['onreconnect'];
    }
  }]);

  return WebSocketClient;
}();

/**
 * The connection is not yet open.
 */


WebSocketClient.CONNECTING = WebSocket.CONNECTING;

/**
 * The connection is open and ready to communicate.
 */
WebSocketClient.OPEN = WebSocket.OPEN;

/**
 * The connection is in the process of closing.
 */
WebSocketClient.CLOSING = WebSocket.CLOSING;

/**
 * The connection is closed or couldn't be opened.
 */
WebSocketClient.CLOSED = WebSocket.CLOSED;

exports.default = WebSocketClient;

},{"./backoff":1}]},{},[2])(2)
});
