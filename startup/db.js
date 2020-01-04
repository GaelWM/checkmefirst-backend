const config = require('config');
const winston = require('winston');
const mongoose = require('mongoose');

module.exports = async function () {
	await mongoose
		.connect(config.get('db'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		})
		.then(() => winston.info(`Connected to ${config.get('db')}...`))
		.catch((error) => winston.error(error));
};
