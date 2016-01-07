
var redis = require('redis'),
    exceptionManager = require('../../exception-manager/exception-manager.js');

var  Logger = require('../../logger/logger.js');


var RedisStore = module.exports = function (configuration) {
    this.logger_ = new Logger();

    if (configuration) {
        if (configuration.REDIS_CLIENT) {
            this.client_ = configuration.REDIS_CLIENT;
        }
        else {
            this.host_ = configuration.REDIS_HOST ? configuration.REDIS_HOST : DEFAULT_CONFIG.REDIS_HOST;
            this.port_ = configuration.REDIS_PORT ? configuration.REDIS_PORT : DEFAULT_CONFIG.REDIS_PORT;
            this.password_ = configuration.REDIS_PASSWORD ? configuration.REDIS_PASSWORD : DEFAULT_CONFIG.REDIS_PASSWORD;
            this.database_ = configuration.REDIS_DATABASE ? configuration.REDIS_DATABASE : DEFAULT_CONFIG.REDIS_DATABASE;
            this.retry_max_delay_ = configuration.REDIS_RETRY_MAX_DELAY ? configuration.REDIS_RETRY_MAX_DELAY:DEFAULT_CONFIG.REDIS_RETRY_MAX_DELAY;
        }
    }
    else {
        this.host_ = DEFAULT_CONFIG.REDIS_HOST;
        this.port_ = DEFAULT_CONFIG.REDIS_PORT;
        this.password_ = DEFAULT_CONFIG.REDIS_PASSWORD;
        this.database_ = DEFAULT_CONFIG.REDIS_DATABASE;
        this.retry_max_delay_ = DEFAULT_CONFIG.REDIS_RETRY_MAX_DELAY;
    }
};

/**
 * @static
 * @const
 */
var DEFAULT_CONFIG = {
    'REDIS_HOST': '0.0.0.0',
    'REDIS_PORT': '6379',
    'REDIS_PASSWORD': 'iloveredis',
    'REDIS_DATABASE': '0',
    'REDIS_RETRY_MAX_DELAY': 30*1000
};

/**
 * @private
 */
RedisStore.prototype.id_ = 'redis';

/**
 * @private
 */
RedisStore.prototype.client_ = null;

/**
 * @private
 */
RedisStore.prototype.logger_ = null;

/**
 * @private
 */
RedisStore.prototype.host_ = null;

/**
 * @private
 */
RedisStore.prototype.port_ = null;

/**
 * @private
 */
RedisStore.prototype.password_ = null;

/**
 * @private
 */
RedisStore.prototype.database_ = null;

/**
 * @public
 */
RedisStore.prototype.getId = function () {
    return this.id_;
};

/**
 * @public
 * @param {string} newId The module new identifier
 */
RedisStore.prototype.setId = function (newId) {
    this.id_ = newId;
};

/**
 * @public
 * @param {function} callback The function called when the operation finishes.
 */
RedisStore.prototype.initialize = function (callback) {
    var self = this;

    if (self.client_ != null) {
        if (callback && typeof (callback) == 'function') {
            callback(null, 'OK');
        }
    }
    else {
        self.logger_.info("[Store Provider Redis] Creating Redis client");
        self.logger_.debug("[Store Provider Redis] Redis - host: " + self.host_ + ", port: " + self.port_ + ", database: " + self.database_);

        self.client_ = redis.createClient(self.port_, self.host_,{retry_max_delay:self.retry_max_delay_});

        self.client_.on("error", function (err) {
            err = exceptionManager.generate('RST1', err);

            if (callback && typeof (callback) == 'function') {
                callback(err, null);
            }
        });

        self.client_.on("ready", function () {
            self.logger_.debug("[Store Provider Redis] Ready");
        });

        self.client_.on("connect", function () {
            self.logger_.debug("[Store Provider Redis] Connect");
        });

        self.client_.on("reconnecting", function (reconnecting) {
            self.logger_.debug("[Store Provider Redis] Reconnecting " + JSON.stringify(reconnecting));
        });

        self.client_.on("end", function () {
            self.logger_.debug("[Store Provider Redis] End");
        });

        self.client_.on("drain", function () {
            self.logger_.debug("[Store Provider Redis] Drain");
        });

        self.client_.on("idle", function () {
            self.logger_.debug("[Store Provider Redis] Idle");
        });

        // Authenticate to the server
        self.client_.AUTH(self.password_, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST2', err);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                self.logger_.info("[Store Provider Redis] Redis client authenticated");

                self.client_.SELECT(self.database_, function (err, res) {
		            if (err) {
		                err = exceptionManager.generate('RST3', err);

		                if (callback && typeof (callback) == 'function') {
		                    callback(err, null);
		                }
		            }
		            else {
		                self.logger_.info("[Store Provider Redis] Redis client database set to " + self.database_);

                        setInterval(function() {
                            self.client_.GET("__keepalive__", function (err, res) {
                                // NOP - ONLY TO KEEP THE CONNECTION ALIVE
                            });
                        }, 60 * 1000);

		                if (callback && typeof (callback) == 'function') {
		                	callback(null, res);
		                }
		            }
		        });
            }
        });
    }
};

/**
 * @public
 * @param {function} callback The function called when the operation finishes.
 */
RedisStore.prototype.destroy = function (callback) {
    var self = this;

    if (self.client_ != null) {
        self.client_.quit(function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST8', 'Client is not connected: ' + err);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                self.logger_.info("[Store Provider Redis] Redis client ended");

                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
    else {
        err = exceptionManager.generate('RST7', 'Client is null');

        if (callback && typeof (callback) == 'function') {
            callback(err, null);
        }
    }
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, field, callback }.
 */
RedisStore.prototype.get = function (obj) {
    var key = obj.key;
    var field = obj.field;
    var fields = obj.fields
    var callback = obj.callback;

    if (field) {
        this.client_.HGET(key, field, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST9', err + ' - key:' + key + ' - field:' + field);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }else if (fields) {
        this.client_.HMGET(key, fields, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST9', err + ' - key:' + key + ' - fields:' + fields);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
    }
    else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }else {
        this.client_.GET(key, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST10', err + ' - key:' + key);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, callback }.
 */
RedisStore.prototype.getAll = function (obj) {
    var key = obj.key;
    var callback = obj.callback;

    this.client_.HGETALL(key, function (err, res) {
        if (err) {
            err = exceptionManager.generate('RST22', err + ' - key:' + key);

            if (callback && typeof (callback) == 'function') {
                callback(err, null);
            }
        }
        else {
            if (callback && typeof (callback) == 'function') {
                callback(null, res);
            }
        }
    });
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, field, value, fvArray, callback }.
 */
RedisStore.prototype.set = function (obj) {
    var key = obj.key;
    var field = obj.field;
    var value = obj.value;
    var fvArray = obj.fvArray; // field-value array [field1 value1 field2 value2 ...]
    var callback = obj.callback;

    if (field) {
        this.client_.HSET(key, field, value, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST11', err + ' - key:' + key + ' - field:' + field + ' - value:' + value);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
    else if (fvArray) {
        this.client_.HMSET(key, fvArray, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST12', err + ' - key:' + key + ' - fvArray:' + fvArray);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
    else {
        this.client_.SET(key, value, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST13', err + ' - key:' + key + ' - value:' + value);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, callback }.
 */
RedisStore.prototype.del = function (obj) {
    var key = obj.key;
    var field = obj.field;
    var callback = obj.callback;

    if (field) {
        this.client_.HDEL(key, field, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST21', err + ' - key:' + key + ' - field:' + field);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
    else {
        this.client_.DEL(key, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST14', err + ' - key:' + key);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, quantity, callback }.
 */
RedisStore.prototype.incr = function (obj) {
    var key = obj.key;
    var quantity = obj.quantity;
    var callback = obj.callback;

    if (quantity == 1) {
        this.client_.INCR(key, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST5', err + ' - key:' + key + ' - quantity:' + quantity);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
    else {
        this.client_.INCRBY(key, quantity, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST5', err + ' - key:' + key + ' - quantity:' + quantity);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, quantity, callback }.
 */
RedisStore.prototype.decr = function (obj) {
    var key = obj.key;
    var quantity = obj.quantity;
    var callback = obj.callback;

    if (quantity == 1) {
        this.client_.DECR(key, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST6', err + ' - key:' + key + ' - quantity:' + quantity);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
    else {
        this.client_.DECRBY(key, quantity, function (err, res) {
            if (err) {
                err = exceptionManager.generate('RST6', err + ' - key:' + key + ' - quantity:' + quantity);

                if (callback && typeof (callback) == 'function') {
                    callback(err, null);
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, res);
                }
            }
        });
    }
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, callback }.
 */
RedisStore.prototype.exists = function (obj) {
    var key = obj.key;
    var callback = obj.callback;

    this.client_.EXISTS(key, function (err, res) {
        if (err) {
            err = exceptionManager.generate('RST15', err + ' - key:' + key);

            if (callback && typeof (callback) == 'function') {
                callback(err, null);
            }
        }
        else {
            if (callback && typeof (callback) == 'function') {
                callback(null, res);
            }
        }
    });
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, callback }.
 */
RedisStore.prototype.persist = function (obj) {
    var key = obj.key;
    var callback = obj.callback;

    this.client_.PERSIST(key, function (err, res) {
        if (err) {
            err = exceptionManager.generate('RST16', err + ' - key:' + key);

            if (callback && typeof (callback) == 'function') {
                callback(err, null);
            }
        }
        else {
            if (callback && typeof (callback) == 'function') {
                callback(null, res);
            }
        }
    });
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, callback }.
 */
RedisStore.prototype.ttl = function (obj) {
    var key = obj.key;
    var callback = obj.callback;

    this.client_.TTL(key, function (err, res) {
        if (err) {
            err = exceptionManager.generate('RST17', err + ' - key:' + key);

            if (callback && typeof (callback) == 'function') {
                callback(err, null);
            }
        }
        else {
            if (callback && typeof (callback) == 'function') {
                callback(null, res);
            }
        }
    });
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, time, callback }.
 */
RedisStore.prototype.expire = function (obj) {
    var key = obj.key;
    var time = obj.time; // seconds
    var callback = obj.callback;

    this.client_.EXPIRE(key, time, function (err, res) {
        if (err) {
            err = exceptionManager.generate('RST18', err + ' - key:' + key + ' - time:' + time);

            if (callback && typeof (callback) == 'function') {
                callback(err, null);
            }
        }
        else {
            if (callback && typeof (callback) == 'function') {
                callback(null, res);
            }
        }
    });
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, datetime, callback }.
 */
RedisStore.prototype.expireAt = function (obj) {
    var key = obj.key;
    var dateTime = obj.dateTime;
    var callback = obj.callback;

    this.client_.EXPIREAT(key, dateTime, function (err, res) {
        if (err) {
            err = exceptionManager.generate('RST19', err + ' - key:' + key + ' - dateTime:' + dateTime);

            if (callback && typeof (callback) == 'function') {
                callback(err, null);
            }
        }
        else {
            if (callback && typeof (callback) == 'function') {
                callback(null, res);
            }
        }
    });
};

/**
 * @public
 * @param {object} obj - A JSON object with the format { key, callback }.
 */
RedisStore.prototype.keys = function (obj) {
    var self = this;
    var key = obj.key;
    var callback = obj.callback;
    var arrIndex = 0;
    var returnedKeys = null;
    var returnedGetAll = Object.create(null);

    self.client_.KEYS(key, function (err, res) {
        if (err) {
            err = exceptionManager.generate('RST20', err + ' - key:' + key);

            if (callback && typeof (callback) == 'function') {
                callback(err, null);
            }
        }
        else {
            if (res && res.length > 0) {
                returnedKeys = res;

                // Call HGETALL for each key
                for (var i = 0; i < res.length; i++) {
                    self.client_.HGETALL(res[i], function (err, resGetAll) {
                        if (err) {
                            err = exceptionManager.generate('RST4', err + ' - key:' + res[i]);

                            if (callback && typeof (callback) == 'function') {
                                callback(err, null);
                            }
                        }
                        else {
                            returnedGetAll[res[arrIndex]] = resGetAll;

                            arrIndex++;
                        }

                        if (arrIndex == i) {
                            if (callback && typeof (callback) == 'function') {
                                callback(null, returnedGetAll);
                            }
                        }
                    });
                }
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, null);
                }
            }
        }
    });
};
/**
* @public
* @param {object} obj - A JSON object with the format { key, callback }.
*/
RedisStore.prototype.findKeys = function (obj) {
    var self = this;
    var key = obj.key;
    var callback = obj.callback;
    var arrIndex = 0;

    self.client_.KEYS(key, function (err, res) {
        if (err) {
            err = exceptionManager.generate('RST20', err + ' - key:' + key);

            if (callback && typeof (callback) == 'function') {
                callback(err, null);
            }
        }
        else {
            if (res && res.length > 0) {
                callback(null, res);
            }
            else {
                if (callback && typeof (callback) == 'function') {
                    callback(null, null);
                }
            }
        }
    });
};
