var Logger = require('../utils/logger/logger.js'),
  async = require('async'),
  Store = require('../utils/store/store');

var BillingData = function() {

}

BillingData.instance = null;

BillingData.getInstance = function() {
  if (this.instance === null) {
    this.instance = new BillingData();
  }
  return this.instance;
};

BillingData.prototype = {
  initialize: function(configuration, callback) {

    this.cachesTtl = {
      L1: configuration.CACHE_L1_TTL ? configuration.CACHE_L1_TTL : 60 * 10,
      L2: configuration.CACHE_L2_TTL ? configuration.CACHE_L2_TTL : 60 * 60
    };

    this.cachesStore = {
      L1: null,
      L2: null
    };

    this.configuration = configuration;

    this.logger = new Logger();
    this.logger.setContext('Billing Data Bussiness');

    this.initializeStores(configuration, callback);
  },
  initializeStores: function(configuration, callback) {
    var self = this;

    async.waterfall([
      function(callback) {
        self.initializeStore("L1", function(error) {
          callback(error)
        });
      },
      function(callback) {
        self.initializeStore("L2", function(error) {
          callback(error)
        });
      }

    ], function(err, data) {
      if (err) {
        throw err;
      } else {
        callback();
      }

    });

  },
  initializeStore: function(level, callback) {

    this.logger.info("Store", level, "initializing");
    this.logger.debug("InitializeStore for level ", level, " with configuration ", this.configuration["STORE_CACHE_" + level + "_CLIENTS"]);

    Store.initializeProviders({
      providerName: this.configuration["STORE_CACHE_" + level + "_PROVIDER"],
      storeClients: this.configuration["STORE_CACHE_" + level + "_CLIENTS"]
    }, function(error, providers) {
      if (error) {
        this.logger.warn("Failed to initialize store", level, "-", error);
      } else {
        this.logger.debug("initilizarStore for level ", level, " with providers length ", providers.length);
        this.cachesStore[level] = new Store(providers);
        this.logger.info("Store", level, "initialized");
      }

      callback(error);
    }.bind(this));
  },
  insertPricingKey: function(key, object, callback) {
    var self = this;
    self.performOperation("set", "L2", null, {
      key: key,
      value: JSON.stringify(object),
      callback: function(err, data) {
        if (callback) {
          callback(err, data);
        }
      }
    });
  },
  getKeyFromRedis: function(key,callback) {
    var self = this;

    async.waterfall([
      function(callback) {
        self.performOperation("get", "L2", null, {
          key: key,
          callback: function(err, data) {
            if (callback) {
              callback(err, data);
            }
          }
        });
      }
    ], function(err, data) {
        callback(err,data);
    });

  },
  performOperation: function(operation, level, time, args) {

    var self = this;

    self.cachesStore[level][operation].apply(self.cachesStore[level], [args]);

    if (time) {
      self.cachesStore[level].expire({
        key: args.key,
        time: time,
        callback: function(error, result) {
          if (!error) {
            self.logger.debug("Key:", args.key, "expires in", time, "seconds");
          }
        }
      });
    }
  }

}


exports = module.exports = BillingData.getInstance();;
