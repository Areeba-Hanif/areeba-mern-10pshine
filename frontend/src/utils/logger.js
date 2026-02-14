import pino from 'pino';

const logger = pino({
  browser: { asObject: true },
  level: 'debug',
  base: {
    env: import.meta.env.MODE,
    revision: '1.0.0',
  },
});

export default logger;