/* eslint-disable import/first */
import envConfig from './config/config';

import { app } from './app';
import MongoConnection from './providers/mongo-connection';
import { logger } from './providers/logger';
import { ServerGlobal } from './types/global';

declare const global: ServerGlobal;
global.isServerConnected = false;

const mongoConnection = new MongoConnection(envConfig.MONGODB_URI);
if (envConfig.MONGODB_URI == null) {
  logger.log({
    level: 'error',
    message: 'MONGODB_URI not specified in environment'
  });
  process.exit(1);
} else {
  mongoConnection.connect(() => {
    // eslint-disable-next-line no-console
    console.log('global.isServerConnected', global.isServerConnected);
    if (!global.isServerConnected) {
      app.listen(app.get('port'), (): void => {
        console.log('\x1b[36m%s\x1b[0m', // eslint-disable-line
          `🌏 Express server started at http://localhost:${app.get('port')}   `);
        global.isServerConnected = true;
        // intializeRbca();
      });
    }
  });
}

// Close the Mongoose connection, when receiving SIGINT
process.once('SIGUSR2', () => {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', () => {
  logger.info('Gracefully shutting down');
  mongoConnection.close(err => {
    if (err) {
      logger.log({
        level: 'error',
        message: 'Error shutting closing mongo connection',
        error: err
      });
    }
    process.exit(0);
  });
});
