// jest.polyfills.js
const { TextEncoder, TextDecoder } = require('node:util');

Object.defineProperties(global, {
  TextEncoder: { value: TextEncoder },
  TextDecoder: { value: TextDecoder },
});