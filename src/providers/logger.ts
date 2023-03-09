import {
  createLogger,
  format,
  transports
} from 'winston';

import moment from 'moment';

const logTransports = [
  new transports.File({
    level: 'error',
    filename: `./logs/error/${moment().format('DD-MMM-YYYY')}/Error-Activity-${moment().format('hha')}.log`,
    zippedArchive: true,
    maxFiles: 30,
    format: format.json({
      replacer: (key:string, value:any) => {
        if (key === 'error') {
          return {
            message: (value as Error).message,
            stack: (value as Error).stack
          };
        }
        return value;
      }
    })
  }),
  new transports.Console({
    level: 'debug',
    format: format.prettyPrint()
  }),
  new transports.File({
    level: 'info',
    filename: `./logs/info/${moment().format('DD-MMM-YYYY')}/Info-Activity-${moment().format('hha')}.log`,
    format: format.prettyPrint(),
    maxFiles: 7
  })
];

export const logger = createLogger({
  format: format.combine(
    format.timestamp()
  ),
  transports: logTransports,
  defaultMeta: { service: 'api' }
});
