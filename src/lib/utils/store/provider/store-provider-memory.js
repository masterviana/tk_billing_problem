var exceptionManager = require('../../exception-manager/exception-manager.js');

var Logger = require('../../logger/logger.js'),
  ObjectLiterals = require('../../utils.js');

var MemoryStore = module.exports = function (configuration) {
  this.logger_ = new Logger();
};

MemoryStore.prototype.id_ = 'memory';

MemoryStore.prototype.keysTTLInterval_ = Object.create(null);

MemoryStore.prototype.client_ = null;

MemoryStore.prototype.logger_ = null;

MemoryStore.prototype.ticksInterval_ = null;

MemoryStore.prototype.keysTTL_ = Object.create(null);

function createTicksInterval (self) {
  self.ticksInterval_ = setInterval(function () {
    updateKeysTTL(self);
  }, 1000); // every second
}

function updateKeysTTL (self) {
  var hasKey = false;

  for (var item in self.keysTTL_) {
    hasKey = true;

    self.keysTTL_[item]--;

    if (self.keysTTL_[item] <= 0) {
      ObjectLiterals.removeEntry(self.keysTTL_, item);

      if (self.client_) {
        ObjectLiterals.removeEntry(self.client_, item);
      }
    }
  }

  if (!hasKey && self.ticksInterval_) {
    clearInterval(self.ticksInterval_);
    self.ticksInterval_ = null;
  }
}

MemoryStore.prototype.getId = function () {
  return this.id_;
};

MemoryStore.prototype.setId = function (newId) {
  this.id_ = newId;
};

MemoryStore.prototype.initialize = function (callback) {
  this.client_ = Object.create(null);

  this.logger_.info('[Store Provider Memory] Memory client created');

  if (callback && typeof (callback) == 'function') {
    callback(null, 'OK');
  }
};

MemoryStore.prototype.destroy = function (callback) {
  if (this.client_) {
    ObjectLiterals.removeEntry(this, 'client_');

    this.logger_.info('[Store Provider Memory] Memory client ended');

    if (callback && typeof (callback) == 'function') {
      callback(null, 'OK');
    }
  } else {
    err = exceptionManager.generate('MST4', 'Client is null');

    if (callback && typeof (callback) == 'function') {
      callback(err, null);
    }
  }
};

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
        } else {
          error = exceptionManager.generate('MST5', 'Operation against a key holding the wrong kind of value');
        }
      }
    } else {
      // Like Redis GET
      if (this.client_[key]) {
        if (this.client_[key].requireField == true) {
          error = exceptionManager.generate('MST6', 'Operation against a key holding the wrong kind of value');
        } else {
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

MemoryStore.prototype.getAll = function (obj) {
  var key = obj.key;
  var callback = obj.callback;
  var ret = null;
  var error = null;

  // Like Redis HGETALL
  if (this.client_[key]) {
    if (this.client_[key].requireField == true) {
      ret = this.client_[key];
    } else {
      error = exceptionManager.generate('MST10', 'Operation against a key holding the wrong kind of value - key:' + key);
    }
  }

  if (callback && typeof (callback) == 'function') {
    error ? callback(error, null) : callback(null, ret);
  }
};

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
    } else {
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

MemoryStore.prototype.del = function (obj) {
  var key = obj.key;
  var callback = obj.callback;
  var error = null;
  var ret = 0;

  try {
    // Like Redis DEL
    if (this.client_[key]) {
      ObjectLiterals.removeEntry(this.client_, key);
      ret = 1;
    }
  } catch (e) {
    error = e.toString();
  } finally {
    if (callback && typeof (callback) == 'function') {
      error ? callback(error, null) : callback(null, ret);
    }
  }
};

MemoryStore.prototype.incr = function (obj) {
  var key = obj.key;
  var quantity = obj.quantity;
  var callback = obj.callback;
  var error = null;

  // Like Redis INCR
  if (quantity == 1) {
    if (this.client_[key]) {
      if (isNaN(Number(this.client_[key]))) {
        error = exceptionManager.generate('MST2', 'Value is not an integer or out of range - key:' + key);
      } else {
        this.client_[key]++;
      }
    } else {
      this.client_[key] = 1;
    }
  }
  // Like Redis INCRBY
  else {
    var qt;

    if (this.client_[key]) {
      if (isNaN(Number(this.client_[key]))) {
        error = exceptionManager.generate('MST2', 'Value is not an integer or out of range - key:' + key);
      } else {
        qt = parseInt(quantity);

        if (!isNaN(qt)) {
          this.client_[key] += qt;
        }
      }
    } else {
      qt = parseInt(quantity);

      if (!isNaN(qt)) {
        this.client_[key] = qt;
      }
    }
  }

  if (callback && typeof (callback) == 'function') {
    error ? callback(error, null) : callback(null, this.client_[key]);
  }
};

MemoryStore.prototype.decr = function (obj) {
  var key = obj.key;
  var quantity = obj.quantity;
  var callback = obj.callback;
  var error = null;

  // Like Redis DECR
  if (quantity == 1) {
    if (this.client_[key]) {
      if (isNaN(Number(this.client_[key]))) {
        error = exceptionManager.generate('MST3', 'Value is not an integer or out of range - key:' + key);
      } else {
        this.client_[key]--;
      }
    } else {
      this.client_[key] = -1;
    }
  }
  // Like Redis DECRBY
  else {
    var qt;

    if (this.client_[key]) {
      if (isNaN(Number(this.client_[key]))) {
        error = exceptionManager.generate('MST3', 'Value is not an integer or out of range - key:' + key);
      } else {
        qt = parseInt(quantity);

        if (!isNaN(qt)) {
          this.client_[key] -= qt;
        }
      }
    } else {
      qt = parseInt(quantity);

      if (!isNaN(qt)) {
        this.client_[key] = -qt;
      }
    }
  }

  if (callback && typeof (callback) == 'function') {
    error ? callback(error, null) : callback(null, this.client_[key]);
  }
};

MemoryStore.prototype.exists = function (obj) {
  var key = obj.key;
  var callback = obj.callback;
  var error = null;
  var ret = null;

  try {
    // Like Redis EXISTS
    ret = this.client_[key] === undefined ? 0 : 1;
  } catch (e) {
    error = e.toString();
  } finally {
    if (callback && typeof (callback) == 'function') {
      error ? callback(error, null) : callback(null, ret);
    }
  }
};

MemoryStore.prototype.persist = function (obj) {
  var key = obj.key;
  var callback = obj.callback;
  var error = null;
  var ret = 0;

  try {
    // Like Redis PERSIST
    if (this.keysTTLInterval_[key] && this.keysTTLInterval_[key].expireSet) {
      clearInterval(this.keysTTLInterval_[key]);

      this.keysTTLInterval_[key].expireSet = false;

      ret = 1;
    }
  } catch (e) {
    error = e.toString();
  } finally {
    if (callback && typeof (callback) == 'function') {
      error ? callback(error, null) : callback(null, ret);
    }
  }
};

MemoryStore.prototype.ttl = function (obj) {
  var key = obj.key;
  var callback = obj.callback;
  var error = null;
  var ret = null;

  try {
    // Like Redis TTL
    ret = this.keysTTL_[key] ? this.keysTTL_[key] : -1;
  } catch (e) {
    error = e.toString();
  } finally {
    if (callback && typeof (callback) == 'function') {
      error ? callback(error, null) : callback(null, ret);
    }
  }
};

MemoryStore.prototype.expire = function (obj) {
  var key = obj.key;
  var time = obj.time; // seconds
  var callback = obj.callback;
  var error = null;
  var ret = 0;
  var self = this;

  try {
    if (isNaN(Number(time))) {
      error = exceptionManager.generate('MST8', 'Value is not an integer or out of range - key:' + key + ' - time:' + time);
    } else {
      if (self.client_[key]) {
        self.keysTTL_[key] = time; // seconds

        if (!self.ticksInterval_) {
          createTicksInterval(self);
        }

        // Like Redis EXPIRE
        self.keysTTLInterval_[key] = setTimeout(function () {
          if (self.keysTTLInterval_[key]) {
            self.keysTTLInterval_[key].expireSet = false;
          }

          if (self.client_[key]) {
            ObjectLiterals.removeEntry(self.client_, key);
          }
        }, time * 1000);

        self.keysTTLInterval_[key].expireSet = true;

        ret = 1;
      }
    }
  } catch (e) {
    error = e.toString();
  } finally {
    if (callback && typeof (callback) == 'function') {
      error ? callback(error, null) : callback(null, ret);
    }
  }
};

MemoryStore.prototype.expireAt = function (obj) {
  var key = obj.key;
  var dateTime = obj.dateTime;
  var callback = obj.callback;
  var error = null;
  var ret = 0;
  var self = this;

  try {
    if (isNaN(Number(dateTime))) {
      error = exceptionManager.generate('MST9', 'Value is not an integer or out of range - key:' + key + ' - dateTime:' + dateTime);
    } else {
      if (self.client_[key]) {
        // Like Redis EXPIREAT
        var currentDate = new Date();
        var convertedDate = new Date(dateTime * 1000);
        var convertedTime = (convertedDate.getTime() - currentDate.getTime()) / 1000; // seconds

        self.keysTTL_[key] = convertedTime;

        if (!self.ticksInterval_) {
          createTicksInterval(self);
        }

        self.keysTTLInterval_[key] = setTimeout(function () {
          if (self.keysTTLInterval_[key]) {
            self.keysTTLInterval_[key].expireSet = false;
          }

          if (self.client_[key]) {
            ObjectLiterals.removeEntry(self.client_, key);
          }
        }, convertedTime * 1000);

        self.keysTTLInterval_[key].expireSet = true;

        ret = 1;
      }
    }
  } catch (e) {
    error = e.toString();
  } finally {
    if (callback && typeof (callback) == 'function') {
      error ? callback(error, null) : callback(null, ret);
    }
  }
};

MemoryStore.prototype.keys = function (obj) {
  var self = this;
  var key = obj.key;

  // Like Redis KEYS
  var regexPattern = key;

  var hasWildCards = (regexPattern.charAt(0) == '*') || (regexPattern.charAt(regexPattern.length - 1) == '*');

  if (regexPattern.charAt(0) != '*') {
    regexPattern = '^' + regexPattern;
  }

  if (regexPattern.charAt(regexPattern.length - 1) != '*') {
    regexPattern = regexPattern + '$';
  }

  if (hasWildCards) {
    self.keysWithWildCard_(obj, regexPattern, false);
  } else {
    self.keysWithoutWildCard_(obj, false);
  }
};

MemoryStore.prototype.keysWithWildCard_ = function (obj, regexPattern, useArray) {
  var self = this;
  var key = obj.key;
  var callback = obj.callback;
  var error = null;
  var ret;

  if (useArray) {
    ret = [];
  } else {
    ret = Object.create(null);
  }

  regexPattern = regexPattern.replace(/\*/g, '');
  regexPattern = regexPattern.replace(/\?/g, '.');

  // Like Redis KEYS and then HGETALL for each key
  for (var item in this.client_) {
    if (item.match(regexPattern) != null) {
      var condition = useArray ? this.client_[item] : this.client_[item] && this.client_[item].requireField == true;

      if (condition) {
        if (useArray) {
          ret.push(item);
        } else {
          ret[item] = this.client_[item];
        }
      } else {
        error = exceptionManager.generate('MST1', 'Operation against a key holding the wrong kind of value - key:' + item);
        break;
      }
    }
  }

  if (callback && typeof (callback) == 'function') {
    error ? callback(error, null) : callback(null, ret);
  }
};

MemoryStore.prototype.keysWithoutWildCard_ = function (obj, useArray) {
  var key = obj.key;
  var callback = obj.callback;
  var ret;

  if (useArray) {
    ret = [];
  } else {
    ret = Object.create(null);
  }

  var condition = useArray ? this.client_[key] : this.client_[key] && this.client_[key].requireField == true;

  if (condition) {
    if (useArray) {
      ret.push(key);
    } else {
      ret[key] = this.client_[key];
    }
  }

  if (callback && typeof (callback) == 'function') {
    callback(null, ret);
  }
};

MemoryStore.prototype.findKeys = function (obj) {
  var self = this;
  var key = obj.key;

  // Like Redis KEYS
  var regexPattern = key;

  var hasWildCards = (regexPattern.charAt(0) == '*') || (regexPattern.charAt(regexPattern.length - 1) == '*');

  if (regexPattern.charAt(0) != '*') {
    regexPattern = '^' + regexPattern;
  }

  if (regexPattern.charAt(regexPattern.length - 1) != '*') {
    regexPattern = regexPattern + '$';
  }

  if (hasWildCards) {
    self.keysWithWildCard_(obj, regexPattern, true);
  } else {
    self.keysWithoutWildCard_(obj, true);
  }
};
