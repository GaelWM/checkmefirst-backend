const config = require('config');
const winston = require('winston');
const mongoose = require('mongoose');

module.exports = async function() {
	await mongoose
		.createConnection(config.get('db'), {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		.then(() => winston.info(`Connected to ${config.get('db')}...`))
		.catch((error) => winston.error(error));
};
