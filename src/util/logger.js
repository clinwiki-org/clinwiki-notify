import {createLogger,transports,format} from 'winston';

const split = require('split');

var options = {
    console: {
        format: format.combine(
            format.colorize(),
            format.simple()),        
        level: 'debug',
        handleExceptions: true
    }
};


let logger = createLogger({
    format: format.combine(        
        format.errors({ stack: true }),
        format.splat()
      ),
    transports: [
        new transports.Console(options.console)

    ],
    exitOnError: false
});

logger.stream = split().on('data', message => logger.info(message));

export default logger;
