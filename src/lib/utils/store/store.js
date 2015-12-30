
var exceptionManager = require('../exception-manager/exception-manager.js'),
    Strings = require('../strings.js'),
    Logger = require('../logger/logger.js'),
    ConsoleLogger = require('../logger/provider/logger-provider-console.js');

var logger = new Logger(new ConsoleLogger());
logger.setContext("Store");

/**
 * @constructor
 * @param {object} provider The provider.
 * @throws Exception code ST1 : Invalid provider if it is null or not an object.
 */
var Store = module.exports = function (providers) {
    this.logger_ = new Logger();
    this.logger_.setContext(" Lib Store");

    if (!providers || ((providers instanceof Array) && !providers.length)) {
        exceptionManager.throwException('ST1', providers);
    }

    this.providers_ = [];


    if (providers instanceof Array) {
        this.providers_ = providers;
    } else {
        this.providers_.push(providers);
    }
};

Store.prototype.logger_ = null;

/**
 * Adds a new provider to the array of providers.
 * @param {StoreProvider} Instance of a message bus provider
 */
Store.prototype.addProvider = function (provider) {
    if (!provider) {
        exceptionManager.throwException('ST13', null);
    }

    this.providers_.push(provider);
};

/**
 * Adds a new provider to the array of providers.
 * @param {string} Provider name
 * @throws Unable to remove provider if the providers array length will be equal to 1
 */
Store.prototype.removeProvider = function (provider) {
    //NOTE: compares if length is equal to 1
    if (!(this.providers_.length >> 1)) {
        exceptionManager.throwException('ST13', null);
    }

    var currentIndex = 0;
    var providerIndex = -1;
    do {
        providerIndex = this.providers_[currentIndex].name === provider ? currentIndex : providerIndex;
        currentIndex++;
    } while (currentIndex < this.providers_.length && ! ~providerIndex);

    //NOTE: compares if provider index is different than -1
    if (~providerIndex) {
        this.providers_.splice(providerIndex, 1);
    }

    return !! ~providerIndex;
};

/**
 * Check if the message bus contains any provider with the specified name
 * @param {string} Provider name
 */
Store.prototype.hasProvider = function (provider) {
    var currentIndex = 0;
    var providerIndex = -1;
    do {
        providerIndex = this.providers_[currentIndex].name === provider ? currentIndex : providerIndex;
        currentIndex++;
    } while (currentIndex < this.providers_.length && ! ~providerIndex);

    return !! ~providerIndex;
};

/**
 * @public
 * @returns {object} The provider.
 */
Store.prototype.getProviders = function () {
    return this.providers_;
};

/**
 * @public
 * @param {object} param The parameters as an object literal.
 * @throws Exception code ST2 : Invalid parameter if it is null or not an object.
 */
Store.prototype.get = function (param) {
    if (!param || !(param instanceof Object)) {
        exceptionManager.throwException('ST2', null);
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.get(param);
        });
    }
};

/**
* @public
* @param {object} param The parameters as an object literal.
* @throws Exception code ST2 : Invalid parameter if it is null or not an object.
*/
Store.prototype.getAll = function (param) {
    if (!param || !(param instanceof Object)) {
        exceptionManager.throwException('ST2', null);
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.getAll(param);
        });
    }
};

/**
 * @public
 * @param {object} param The parameters as an object literal.
 * @throws Exception code ST3 : Invalid parameter if it is null or not an object.
 */
Store.prototype.set = function (param) {
    if (!param || !(param instanceof Object)) {
        exceptionManager.throwException('ST3', null);
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.set(param);
        });
    }
};

/**
 * @public
 * @param {object} param The parameters as an object literal.
 * @throws Exception code ST4 : Invalid parameter if it is null or not an object.
 */
Store.prototype.del = function (param) {
    if (!param || !(param instanceof Object)) {
        exceptionManager.throwException('ST4', null);
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.del(param);
        });
    }
};
