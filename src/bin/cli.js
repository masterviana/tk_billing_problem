
var Logger = require('../lib/utils/logger/logger.js');


var logger_ = new Logger();

logger_.setLevel(3);
logger_.setContext('cli');
logger_.info("Loading configuration from file");
