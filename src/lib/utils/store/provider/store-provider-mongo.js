var exceptionManager = require('../../exception-manager/exception-manager.js');


var Logger = require('../../logger/logger.js'),
    ObjectLiterals = require('../../utils.js');

var MongoStore = module.exports = function (configuration) {
    this.logger_ = new Logger();


    if (configuration) {
        if (configuration.MONGO_CLIENT) {
            this.configuration = configuration.MONGO_CLIENT;
        }
        else {
            this.host_ = configuration.MONGO_HOST ? configuration.MONGO_HOST : DEFAULT_CONFIG.MONGO_HOST;
            this.port_ = configuration.MONGO_PORT ? configuration.MONGO_HOST : DEFAULT_CONFIG.MONGO_HOST;
            this.password_ = configuration.MONGO_PASSWORD ? configuration.MONGO_PASSWORD : DEFAULT_CONFIG.MONGO_PASSWORD;
            this.database_ = configuration.MONGO_DATABASE ? configuration.MONGO_DATABASE : DEFAULT_CONFIG.MONGO_DATABASE;
            this.retry_max_delay_ = configuration.MONGO_RETRY_MAX_DELAY ? configuration.MONGO_RETRY_MAX_DELAY:DEFAULT_CONFIG.MONGO_RETRY_MAX_DELAY;
        }
    }
    else {
        this.host_ = DEFAULT_CONFIG.MONGO_HOST;
        this.port_ = DEFAULT_CONFIG.MONGO_PORT;
        this.password_ = DEFAULT_CONFIG.MONGO_PASSWORD;
        this.database_ = DEFAULT_CONFIG.MONGO_PASSWORD;
        this.retry_max_delay_ = DEFAULT_CONFIG.MONGO_RETRY_MAX_DELAY;
    }

};


/**
 * @static
 * @const
 */
var DEFAULT_CONFIG = {
    'MONGO_HOST': '0.0.0.0',
    'MONGO_PORT': '27017',
    'MONGO_DATABASE': 'mydb',
    'MONGO_RETRY_MAX_DELAY': 30*1000
};

MongoStore.prototype.id_ = 'mongo';

MongoStore.prototype.keysTTLInterval_ = Object.create(null);

MongoStore.prototype.client_ = null;

MongoStore.prototype.logger_ = null;

MongoStore.prototype.ticksInterval_ = null;

MongoStore.prototype.keysTTL_ = Object.create(null);


function createTicksInterval(self) {
    self.ticksInterval_ = setInterval(function () {
        updateKeysTTL(self);
    }, 1000); // every second
};

function updateKeysTTL(self) {
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

    // Remove ticks interval
    if (!hasKey && self.ticksInterval_) {
        clearInterval(self.ticksInterval_);
        self.ticksInterval_ = null;
    }
};

MongoStore.prototype.getId = function () {
    return this.id_;
};

MongoStore.prototype.setId = function (newId) {
    this.id_ = newId;
};

MongoStore.prototype.initialize = function (callback) {
  var self = this;

  if (self.client_ != null) {
      if (callback && typeof (callback) == 'function') {
          callback(null, 'OK');
      }
  }else{
    self.logger_.info("[Store Provider Mongo] Creating Mongo Client");
    self.logger_.debug("[Store Provider Mongo] Mongo - host: " + self.host_ + ", port: " + self.port_ + ", database: " + self.database_);

    try {
      self.client_  = require('monk')(self.host_,'/',self.database_);
    }
    catch(e){
      callback(e,null);
    }finally{
        callback(null,"OK");
    }

  }

};

MongoStore.prototype.destroy = function (callback) {
    var self = this;
    if (self.client_) {
        self.client_.close();
        self.client_ = null;
        this.logger_.info("[Store Provider Mongo] Mongo client ended");

        if (callback && typeof (callback) == 'function') {
            callback(null, 'OK');
        }
    }
    else {
        err = exceptionManager.generate('MST4', 'Client is null');

        if (callback && typeof (callback) == 'function') {
            callback(err, null);
        }
    }
};

MongoStore.prototype.get = function (obj) {
    var self = this;
    var key = obj.key;
    var table = obj.table;
    var callback = obj.callback;
    var error = null;
    var ret = null;

    if(table && key){
      var promise = self.client_.get(table).find({key : key});
      promise.on('complete', function(err, data){
        if(err){
          callback(err,null);
        }else{
          callback(null,data);
        }
      });

    }else{
      callback("No key or table are supplied",null);
    }
};

MongoStore.prototype.getAll = function (obj) {

    // Like Redis HGETALL
    var self = this;
    var table = obj.table;
    var callback = obj.callback;
    var error = null;
    var ret = null;

    if(table){
      var promise = self.client_.get(table).find({});
      promise.on('complete', function(err, data){
        if(err){
          callback(err,null);
        }else{
          callback(null,data);
        }
      });

    }else{
      callback("No key or table are supplied",null);
    }

};

MongoStore.prototype.set = function (obj) {
  var key = obj.key;
  var table = obj.table;
  var itemJson = obj.jsonItem;
  var callback = obj.callback;

    if(table){
      if(key){
        var promise = self.client_.get(table).updateById(key , itemJson);
        promise.on('complete', function(err,data){
          if(err){
            var error = {
              error : err,
              message : "error updated object on mongo",
              item : itemJson
            }
            self.logger_.error(error);
            callback(error,null);
          }else{
            callback(null,data);
          }
        });
      }else{
        var promise =  self.client_.get(table).insert(itemJson);
        promise.on('complete', function(err,data){
          if(err){
            var error = {
              error : err,
              message : "error insert object on mongo",
              item : itemJson
            }
            self.logger_.error(error);
            callback(error,null);
          }else{
            callback(null,data);
          }
        });
      }

    }else{
      callback("No key  are supplied",null);
    }

};
