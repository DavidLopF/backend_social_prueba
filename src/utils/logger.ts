import { createLogger, format, transports } from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import colors from 'colors';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const commonFormat = format.combine(
  format.errors({ stack: true }), // Captura el stack trace
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => {
    const message = info.stack || info.message;
    return `[${info.timestamp}] ${info.level}: ${message}`;
  }),
);

export const logger = createLogger({
  level: 'info',
  format: commonFormat,
  transports: [
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: format.combine(format.uncolorize(), commonFormat),
    }),
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: format.combine(format.uncolorize(), commonFormat),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      level: 'debug', // Muestra más detalles en desarrollo
      format: format.combine(
        format.colorize(),
        format.errors({ stack: true }), // Asegura que también se muestren los stack traces en consola
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf((info) => {
          const message = info.stack || info.message;
          return `[${info.timestamp}] ${info.level}: ${message}`;
        }),
      ),
    }),
  );
}

// Desactivar logs en ambiente de test
if (process.env.NODE_ENV === 'test') {
  logger.silent = true;
}

/**
 * printTitle
 * @param message
 */
export const printTitle = (message: string) => {
  logger.info(colors.white.bold(message));
};

/**
 * printInfo
 * @param message
 */
export const printInfo = (message: string) => {
  logger.info(message);
};

/**
 * success
 * @param message
 */
export const success = (message: string) => {
  logger.info(colors.green(message));
};

/**
 * printError
 * @param error
 */
export const printError = (error: any) => {
  if (typeof error === 'string') {
    logger.error(colors.red(error));
  } else {
    logger.error(colors.red(error.toString()));
  }
};

export default logger;
