var ConsoleLogger = require('./providers/logger-provider-console.js');

/**
 * @constructor
 * @param {object} providers The providers.
 */
var Logger = module.exports = function (providers) {
  if (providers) {
    for (var i = 0; i < providers.length; i++) {
      this.providers_[providers[i].getId()] = providers[i];
    }
  }

  // Just adding a default provider
  this.addProvider(new ConsoleLogger());
};

/**
 * @private
 * @static
 */
Logger.level_ = 0; // Default log level.

/**
 * @private
 */
Logger.prototype.providers_ = Object.create(null);

/**
* @private
*/
Logger.prototype.context_ = null; // Default context to log.

/**
 * @public
 * @param {object} provider The provider.
 */
Logger.prototype.addProvider = function (provider) {
  if (provider) {
    this.providers_[provider.getId()] = provider;
  }
};

/**
 * @public
 * @param {string} providerId The provider identifier.
 * @returns {boolean} Indicates whether the provider has been successfully removed.
 */
Logger.prototype.removeProvider = function (providerId) {
  delete this.providers_[providerId];
};

/**
 * @public
 * @param {string} providerId The provider identifier.
 * @returns {boolean} Indicates whether the provider exists.
 */
Logger.prototype.hasProvider = function (providerId) {
  return this.providers_[providerId] ? true : false;
};

/**
 * @public
 * @returns {int} The logging level.
 */
Logger.prototype.getLevel = function () {
  return Logger.level_;
};

/**
 * @public
 * @param {int} newLevel The logging level.
 */
Logger.prototype.setLevel = function (newLevel) {
  Logger.level_ = newLevel;
};

/**
* @public
* @returns {int} The context to log.
*/
Logger.prototype.getContext = function () {
  return this.context_;
};

/**
* @public
* @param {int} newContext The context to log.
*/
Logger.prototype.setContext = function (newContext) {
  this.context_ = newContext;
};

/**
 * @public
 */
Logger.prototype.debug = function () {
  if (Logger.level_ >= 3) {
    var hasProvider = false;

    for (var providerId in this.providers_) {
      this.providers_[providerId].debug(arguments, this.context_);
      hasProvider = true;
    }

    if (!hasProvider) {
      throw 'debug called - No providers to log';
    }
  }
};

/**
 * @public
 */
Logger.prototype.info = function () {
  if (Logger.level_ >= 2) {
    var hasProvider = false;

    for (var providerId in this.providers_) {
      this.providers_[providerId].info(arguments, this.context_);
      hasProvider = true;
    }

    if (!hasProvider) {
      throw 'info called - No providers to log';
    }
  }
};

/**
 * @public
 */
Logger.prototype.warn = function () {
  if (Logger.level_ >= 1) {
    var hasProvider = false;

    for (var providerId in this.providers_) {
      this.providers_[providerId].warn(arguments, this.context_);
      hasProvider = true;
    }

    if (!hasProvider) {
      throw 'warn called - No providers to log';
    }
  }
};

/**
 * @public
 */
Logger.prototype.error = function () {
  if (Logger.level_ >= 0) {
    var hasProvider = false;

    for (var providerId in this.providers_) {
      this.providers_[providerId].error(arguments, this.context_);
      hasProvider = true;
    }

    if (!hasProvider) {
      throw 'error called - No providers to log';
    }
  }
};
