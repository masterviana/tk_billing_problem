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
  /**
    initializing store
  **/
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
  /**
    get redis key

    miss - implement cache feature, try read from L1 (memory)
    if key doesnt exist create on memory and return
  **/
  getKeyFromRedis: function(key, callback) {
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
      callback(err, data);
    });
  },
  /**
    Insert domain objecton store

    obs : Only have create memory and redis providers, next thing I need to do is create a mongo or mysql provider
    and insert domain objects on there

  **/
  saveDomainObject: function(item, callback) {
    var self = this;

    var insertObject = item.adjustToProdiver();
    self.logger.debug("will save domain object on db ", insertObject);

    self.performOperation("set", "L2", null, {
      key: insertObject.key,
      field: insertObject.field,
      value: insertObject.value,
      callback: function(err, data) {
        if (callback) {
          callback(err, data);
        }
      }
    });

  },
  /**
    List domain object entity based on given filter

    obs : Only have memory and redis provider, in future one nice feature is appliy multiple layers of cache
    with mongo, redis and memory to increase performance
  **/
  listDomainObject: function(item, callback) {
    var self = this;
    self.logger.debug("will list item ", item);

    self.performOperation("getAll", "L2", null, {
      key: item.key,
      callback: function(err, data) {
        if (callback) {
          callback(err, data);
        }
      }
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
