const config = require('config');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
	//winston.format.simple();
	//Catches uncaught exceptions and logs in with winston.
	winston.exceptions.handle(
		new winston.transports.Console({ 'timestamp': true }),
		new winston.transports.File({ filename: 'uncaughtException.log' })
	);

	// Catches unhandledRejection exceptions and logs in with winston.
	// process.on('unhandledRejection', (ex) => {
	// 	throw ex;
	// });

	winston.add(new winston.transports.File({
		filename: 'logfile.log', format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.json()
		)
	}));
	winston.add(new winston.transports.MongoDB({ db: config.get('db'), options: { useUnifiedTopology: true } }));
};
