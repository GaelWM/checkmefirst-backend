const _ = require('lodash');
const winston = require('winston');

module.exports = function (err, req, res, next) {
	// Log the exception
	//error
	//warn
	//info
	//verbose
	//silly

	winston.log('error', `${err}`);
	//console.log('err: ', err);

	// if (!_.isEmpty(err)) {
	// 	if ((!_.isEmpty(err.errors) && (err.errors.name === "ValidatorError" || (_.isEmpty(err.errors.name.name) && err.errors.name.name === "ValidatorError")) && (!_.isEmpty(err.errors) && err.errors.name.kind === "unique"))) {
	// 		res.status(500).send(err.errors.name.message);
	// 	}
	// 	res.status(500).send('Something failed');
	// } else {
	// 	res.status(500).send('Something failed');
	// }

	res.status(500).send('Something failed');
};
