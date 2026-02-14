import { TextEncoder, TextDecoder } from 'util';

// This ensures they are available on the global window object before React Router loads
Object.defineProperty(global, 'TextEncoder', {
  value: TextEncoder
});
Object.defineProperty(global, 'TextDecoder', {
  value: TextDecoder
});

// Mocking the logger and api here as well
jest.mock('./src/utils/logger', () => ({
  default: { info: jest.fn(), error: jest.fn(), debug: jest.fn() }
}));