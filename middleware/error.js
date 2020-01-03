const winston = require('winston');

module.exports = function(err, req, res, next) {
	// Log the exception
	//error
	//warn
	//info
	//verbose
	//silly

	winston.log('error', `${err}`);
	res.status(500).send('Something failed');
};
