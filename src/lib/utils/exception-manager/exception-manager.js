
var util = require('util'),
    Logger = require('../logger/logger.js');

var exceptionCodes_ = {};


var logger_ = new Logger();

/**
 * Generates a exception that should be used to return the callback errors
 * @return {exception} Returns the instance of the exception identified by the exception code
 */
this.generate = function () {
    var exception = getException(arguments);
    return exception;
};

/**
 * Generates a exception that should be used to return the callback errors
 * @throws Exception identified by the exception code
 */
this.throwException = function () {
    var exception = getException(arguments);
    throw exception;
};

/**
 * Generates a exception (info) that should be used to return the callback errors
 * @throws Exception identified by the exception code
 */
this.generateInfo = function () {
    var exception = getExceptionInfo(arguments);
    return exception;
};


/**
 * Sets the exception manager error codes
 * @param {object} Object containing the exceptions that are uniquily identified by their code
 */
this.setErrorCodes = function (codes) {
    exceptionCodes_ = codes ? codes : {};
};

/**
 * Gets the exception manager logger
 * @return {logger} Returns the logger instance
 */
this.getlogger_ = function () {
    return logger_;
};

function getException(args) {
    var e = exceptionCodes_[args[0]];

    if (!e) {
        throw "Invalid exception code '" + args[0] + "'";
    }

    var text = '';

    for (var i = 1; i < args.length; i++) {
        if (i > 1) {
            text += ' ';
        }
        text += typeof (args[i]) == 'object' ? util.inspect(args[i], null, null, false) : args[i];
    }

    logger_.error("Exception with code '", e.code, "' thrown in '", e.context, "' when trying to perform the operation '", e.operation, "' :", e.message, text ? "[" : "", text, text ? "]" : "");

    return e;
};

function getExceptionInfo(args) {
    var e = exceptionCodes_[args[0]];

    if (!e) {
        throw "Invalid exception code '" + args[0] + "'";
    }

    var text = '';

    for (var i = 1; i < args.length; i++) {
        if (i > 1) {
            text += ' ';
        }
        text += typeof (args[i]) == 'object' ? util.inspect(args[i], null, null, false) : args[i];
    }

    logger_.info("Exception with code '", e.code, "' thrown in '", e.context, "' when trying to perform the operation '", e.operation, "' :", e.message, text ? "[" : "", text, text ? "]" : "");

    return e;
};
