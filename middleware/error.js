const winston = require('winston');

module.exports = function (err, req, res, next) {
	// Log the exception
	//error
	//warn
	//info
	//verbose
	//silly

	winston.log('error', `${err}`);
	//console.log('err: ', err.errors.name.name);
	// if (err.errors.name.name === 'ValidatorError' && err.errors.name.kind === 'unique') {
	// 	res.status(500).send(`"${err.errors.name.path}" to be unique. Value: "${err.errors.name.value}" `);
	// } else {
	// 	res.status(500).send('Something failed');
	// }

	res.status(500).send('Something failed');

};
