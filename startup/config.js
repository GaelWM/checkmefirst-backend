const config = require('config');
const winston = require('winston');

module.exports = function(){
    const jwtPrivateKey = config.get('jwtPrivateKey');
    if (!jwtPrivateKey) {
        winston.error("FATAL ERROR: jwtPrivateKey is not defined.");
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}