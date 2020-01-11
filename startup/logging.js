const config = require('config');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
	//winston.format.simple();
	//Catches uncaught exceptions and logs in with winston.
	winston.exceptions.handle(
		new winston.transports.Console({
			format: winston.format.json(),
			colorize: true,
			prettyPrint: true,
			handleExceptions: true,
			timestamp: true
		}),
		new winston.transports.File({
			filename: 'uncaughtException.log',
			format: winston.format.combine(
				winston.format.timestamp({
					format: 'YYYY-MM-DD hh:mm:ss A ZZ',
				}),
				winston.format.json()
			)
		})
	);

	// //Catches unhandledRejection exceptions and logs in with winston.
	process.on('unhandledRejection', (ex) => {
		// throw ex;
		winston.log(ex).add(new winston.transports.Console({
			format: winston.format.simple(),
			colorize: true,
			prettyPrint: true,
			handleExceptions: true,
			timestamp: true
		}));
	});

	winston.add(new winston.transports.File({ filename: 'logfile.log', timestamp: true }));
	winston.add(new winston.transports.MongoDB({ db: config.get('db'), options: { useUnifiedTopology: true } }));
};
