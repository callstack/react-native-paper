// Ensure web-compatible globals exist during Node build (undici requires File).
if (typeof globalThis.File === 'undefined') {
  globalThis.File = require('undici').File;
}

