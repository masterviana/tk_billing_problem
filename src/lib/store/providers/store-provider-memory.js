
var Logger = require('/logger/logger.js'),


/**
 * @constructor
 * @param {object} configuration The configuration to use.
 */
var MemoryStore = module.exports = function (configuration) {
    this.logger_ = new Logger([new ConsoleLogger()]);
};


/**
 * @private
 */
MemoryStore.prototype.id_ = 'memory';

/**
 * @private
 */
MemoryStore.prototype.keysTTLInterval_ = Object.create(null);

/**
* @private
*/
MemoryStore.prototype.client_ = null;

/**
 * @private
 */
MemoryStore.prototype.logger_ = null;

/**
 * @private
 */
MemoryStore.prototype.ticksInterval_ = null;

/**
 * @private
 */
MemoryStore.prototype.keysTTL_ = Object.create(null);


/**
 * @public
 */
MemoryStore.prototype.getId = function () {
    return this.id_;
};

/**
 * @public
 * @param {string} newId The module new identifier
 */
MemoryStore.prototype.setId = function (newId) {
    this.id_ = newId;
};

/**
 * @public
 * @param {function} callback The function called when the operation finishes.
 */
MemoryStore.prototype.initialize = function (callback) {
    this.client_ = Object.create(null);

    this.logger_.info("[Store Provider Memory] Memory client created");

    if (callback && typeof (callback) == 'function') {
        callback(null, 'OK');
    }
};



/**
 * @public
 * @param {object} obj - A JSON object with the format { key, field, callback }.
 */
MemoryStore.prototype.get = function (obj) {
    var key = obj.key;
    var field = obj.field;
    var callback = obj.callback;
    var error = null;
    var ret = null;

    try {
        if (field) {
            // Like Redis HGET
            if (this.client_[key]) {
                if (this.client_[key].requireField == true) {
                    if (this.client_[key][field]) {
                        ret = this.client_[key][field];
                    }
                }
                else {
                    error = exceptionManager.generate('MST5', 'Operation against a key holding the wrong kind of value');
                }
            }
        }
        else {
            // Like Redis GET
            if (this.client_[key]) {
                if (this.client_[key].requireField == true) {
                    error = exceptionManager.generate('MST6', 'Operation against a key holding the wrong kind of value');
                }
                else {
                    ret = this.client_[key];
                }
            }
        }
    } catch (e) {
        error = exceptionManager.generate('MST7', e.toString());
    } finally {
        if (callback && typeof (callback) == 'function') {
            error ? callback(error, null) : callback(null, ret);
        }
    }
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, callback }.
 */
MemoryStore.prototype.getAll = function (obj) {
    var key = obj.key;
    var callback = obj.callback;
    var ret = null;
    var error = null;

    // Like Redis HGETALL
    if (this.client_[key]) {
        if (this.client_[key].requireField == true) {
            ret = this.client_[key];
        }
        else {
            error = exceptionManager.generate('MST10', 'Operation against a key holding the wrong kind of value - key:' + key);
        }
    }

    if (callback && typeof (callback) == 'function') {
        error ? callback(error, null) : callback(null, ret);
    }
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, field, value, fvArray, callback }.
 */
MemoryStore.prototype.set = function (obj) {
    var key = obj.key;
    var field = obj.field;
    var value = obj.value;
    var fvArray = obj.fvArray; // field-value array [field1 value1 field2 value2 ...]
    var callback = obj.callback;
    var isUpdate = false;
    var error = null;
    var ret = 'OK';

    try {
        if (field) {
            if (!this.client_[key]) {
                this.client_[key] = Object.create(null);
            }

            if (this.client_[key][field]) {
                isUpdate = true;
                this.client_[key][field] = value;
            }

            if (!this.client_[key][field]) {
                // Like Redis HSET
                this.client_[key][field] = value;
                this.client_[key].requireField = true;
            }

            ret = isUpdate ? 0 : 1;
        }
        else if (fvArray) {
            isUpdate = !!this.client_[key];

            this.client_[key] = fvArray;
            this.client_[key].requireField = true;

            ret = isUpdate ? 0 : 1;
        }
        else {
            isUpdate = !!this.client_[key];

            this.client_[key] = value;
            this.client_[key].requireField = false;

            ret = isUpdate ? 0 : 1;
        }
    } catch (e) {
        error = e.toString();
    } finally {
        if (callback && typeof (callback) == 'function') {
            error ? callback(error, null) : callback(null, ret);
        }
    }
};
