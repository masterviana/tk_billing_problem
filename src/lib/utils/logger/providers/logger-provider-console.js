var util = require("util");

/**
 * @constructor
 */
var ConsoleLogger = module.exports = function () {
};

/**
 * @private
 */
ConsoleLogger.prototype.id_ = 'console';

/**
 * @public
 */
ConsoleLogger.prototype.getId = function () {
    return this.id_;
};

/**
 * @public
 * @param {string} newId The module new identifier
 */
ConsoleLogger.prototype.setId = function (newId) {
    this.id_ = newId;
};

/**
 * @public
 * @param {array} args The text to log as an arguments array
 */
ConsoleLogger.prototype.debug = function (args, context) {
    var text = '';

    if (context) {
        text += '[' + context + '] ';
    }

    for (var i = 0; i < args.length; i++) {
        if (i > 0) {
            text += ' ';
        }
        text += typeof (args[i]) == 'object' ? util.inspect(args[i], null, null, false) : args[i];
    }

    console.log('\x1B[90mDEBUG: ' + text + '\x1B[0m');
};

/**
 * @public
 * @param {array} args The text to log as an arguments array
 */
ConsoleLogger.prototype.info = function (args, context) {
    var text = '';

    if (context) {
        text += '[' + context + '] ';
    }

    for (var i = 0; i < args.length; i++) {
        if (i > 0) {
            text += ' ';
        }
        text += typeof (args[i]) == 'object' ? util.inspect(args[i], null, null, false) : args[i];
    }

    console.log('\x1B[36mINFO: ' + text + '\x1B[0m');
};

/**
 * @public
 * @param {array} args The text to log as an arguments array
 */
ConsoleLogger.prototype.warn = function (args, context) {
    var text = '';

    if (context) {
        text += '[' + context + '] ';
    }

    for (var i = 0; i < args.length; i++) {
        if (i > 0) {
            text += ' ';
        }
        text += typeof (args[i]) == 'object' ? util.inspect(args[i], null, null, false) : args[i];
    }

    console.log('\x1B[33mWARN: ' + text + '\x1B[0m');
};

/**
 * @public
 * @param {array} args The text to log as an arguments array
 */
ConsoleLogger.prototype.error = function (args, context) {
    var text = '';

    if (context) {
        text += '[' + context + '] ';
    }

    for (var i = 0; i < args.length; i++) {
        if (i > 0) {
            text += ' ';
        }
        text += typeof (args[i]) == 'object' ? util.inspect(args[i], null, null, false) : args[i];
    }

    console.log('\x1B[31mERROR: ' + text + '\x1B[0m');
};
