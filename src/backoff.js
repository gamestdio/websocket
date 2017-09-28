const backoff = {
  exponential (attempt, delay) {
    return Math.floor(Math.random() * Math.pow(2, attempt) * delay);
  },

  fibonacci (attempt, delay) {
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

export function createBackoff(type, options) {
  return new Backoff(backoff[type], options);
}

function Backoff (func, options) {
  this.func = func;
  this.attempts = 0;
  this.delay = (typeof(options.initialDelay) !== "undefined")
    ? options.initialDelay
    : 100;
}

Backoff.prototype.backoff = function () {
  setTimeout(this.onReady, this.func(++this.attempts, this.delay));
}
