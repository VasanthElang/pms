/* eslint-disable import/first */
import util from 'util';
import envConfig from './config/config';
import { app } from './app';
import SafeMongooseConnection from './providers/mongo-connection';
import { logger } from './providers/logger';

let debugCallback;
if (envConfig.NODE_ENV === 'development') {
  debugCallback = (collectionName: string, method: string, query: any, doc: string): void => {
    const message = `${collectionName}.${method}(${util.inspect(query, { colors: true, depth: null })})`;
    logger.log({
      level: 'verbose',
      message,
      consoleLoggerOptions: { label: 'MONGO' }
    });
  };
}

const safeMongooseConnection = new SafeMongooseConnection({
  mongoUrl: envConfig.MONGODB_URI ?? '',
  debugCallback,
  onStartConnection: mongoUrl => logger.info(`Connecting to MongoDB at ${mongoUrl}`),
  onConnectionError: (error, mongoUrl) => logger.log({
    level: 'error',
    message: `Could not connect to MongoDB at ${mongoUrl}`,
    error
  }),
  onConnectionRetry: mongoUrl => logger.info(`Retrying to MongoDB at ${mongoUrl}`)
});

const serve = () => app.listen(envConfig.PORT, () => {
  logger.info(`🌏 Express server started at http://localhost:${envConfig.PORT}`);

  if (envConfig.NODE_ENV === 'development') {
    // This route is only present in development mode
    logger.info(`⚙️  Swagger UI hosted at http://localhost:${envConfig.PORT}/api/dev/api-docs`);
  }
});

if (envConfig.MONGODB_URI == null) {
  logger.error('MONGO_URL not specified in environment', new Error('MONGODB_URI not specified in environment'));
  process.exit(1);
} else {
  safeMongooseConnection.connect(mongoUrl => {
    logger.info(`Connected to MongoDB at ${mongoUrl}`);
    serve();
  });
}

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', () => {
  console.log('\n'); /* eslint-disable-line */
  logger.info('Gracefully shutting down');
  logger.info('Closing the MongoDB connection');
  safeMongooseConnection.close(err => {
    if (err) {
      logger.log({
        level: 'error',
        message: 'Error shutting closing mongo connection',
        error: err
      });
    } else {
      logger.info('Mongo connection closed successfully');
    }
    process.exit(0);
  }, true);
});
