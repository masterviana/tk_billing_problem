
var storeExceptionCodes = require("./store-exception-codes.js"),
    Strings = require('../utils.js'),
    Logger = require('../logger/logger.js');

var logger = new Logger();
logger.setContext("Provider Context");


var Store = module.exports = function (providers) {
    this.logger_ = new Logger();
    this.logger_.setContext("Billing problem Lib Store");

    if (!providers || ((providers instanceof Array) && !providers.length)) {
        // exceptionManager.throwException('ST1', providers);
        console.log(storeExceptionCodes["ST1"])
    }

    this.providers_ = [];


    if (providers instanceof Array) {
        this.providers_ = providers;
    } else {
        this.providers_.push(providers);
    }
};

Store.prototype.logger_ = null;


Store.prototype.addProvider = function (provider) {
    if (!provider) {
        // exceptionManager.throwException('ST13', null);
          console.log(storeExceptionCodes["ST13"])
    }

    this.providers_.push(provider);
};


Store.prototype.removeProvider = function (provider) {
    //NOTE: compares if length is equal to 1
    if (!(this.providers_.length >> 1)) {
        // exceptionManager.throwException('ST13', null);
        console.log(storeExceptionCodes["ST13"])
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


Store.prototype.hasProvider = function (provider) {
    var currentIndex = 0;
    var providerIndex = -1;
    do {
        providerIndex = this.providers_[currentIndex].name === provider ? currentIndex : providerIndex;
        currentIndex++;
    } while (currentIndex < this.providers_.length && ! ~providerIndex);

    return !! ~providerIndex;
};


Store.prototype.getProviders = function () {
    return this.providers_;
};


Store.prototype.get = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST2', null);
        console.log(storeExceptionCodes["ST2"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.get(param);
        });
    }
};


Store.prototype.getAll = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST2', null);
        console.log(storeExceptionCodes["ST2"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.getAll(param);
        });
    }
};

Store.prototype.set = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST3', null);
        console.log(storeExceptionCodes["ST3"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.set(param);
        });
    }
};


Store.prototype.del = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST4', null);
          console.log(storeExceptionCodes["ST4"])

    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.del(param);
        });
    }
};


Store.prototype.incr = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST5', null);
          console.log(storeExceptionCodes["ST5"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.incr(param);
        });
    }
};


Store.prototype.decr = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST6', null);
        console.log(storeExceptionCodes["ST6"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.decr(param);
        });
    }
};


Store.prototype.exists = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST7', null);
        console.log(storeExceptionCodes["ST7"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.exists(param);
        });
    }
};

Store.prototype.persist = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST8', null);
        console.log(storeExceptionCodes["ST8"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.persist(param);
        });
    }
};


Store.prototype.ttl = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST9', null);
        console.log(storeExceptionCodes["ST9"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.ttl(param);
        });
    }
};

Store.prototype.expire = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST10', null);
        console.log(storeExceptionCodes["ST10"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.expire(param);
        });
    }
};

Store.prototype.expireAt = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST11', null);
        console.log(storeExceptionCodes["ST11"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.expireAt(param);
        });
    }
};


Store.prototype.keys = function (param) {
    if (!param || !(param instanceof Object)) {
        // exceptionManager.throwException('ST12', null);
        console.log(storeExceptionCodes["ST12"])
    }
    else {
        this.getProvider_(param.key, function (provider) {
            provider.keys(param);
        });
    }
};

Store.prototype.findKeys = function (param) {
    var self = this;
    if (!param || !(param instanceof Object)) {
        console.log(storeExceptionCodes["ST12"])
        // exceptionManager.throwException('ST12', null);
    }
    else {
        if (param.key && (self.providers_.length > 1) && ((typeof param.key) == "string") && (param.key.indexOf("*") >= 0)) {
            var checkedProviders = 0;
            var result = null;
            for (var providerIndex = 0; providerIndex < self.providers_.length; providerIndex++) {
                var provider = self.providers_[providerIndex];
                provider.findKeys({
                    key: param.key,
                    callback: function (err,res) {
                        checkedProviders++;
                        if (res) {
                            result = result ? result.concat(res) : res;
                        }

                        if (err || (checkedProviders == self.providers_.length)) {
                            param.callback(err, result);
                        }
                    }
                });
            }
        } else {
            this.getProvider_(param.key, function (provider) {
                provider.findKeys(param);
            });
        }
    }
};

Store.prototype.getProvider_ = function (key, callback) {
    var self = this;
    if (self.providers_.length == 1) {
        callback(self.providers_[0]);
    } else {
        Strings.generateHashCode(key, function (hashCode) {
            var providerIndex = hashCode % self.providers_.length;
            self.logger_.debug('Key', key, '- Hash Code', hashCode, '- Providers length', self.providers_.length);
            self.logger_.debug('Provider index', providerIndex);
            callback(self.providers_[providerIndex]);
        });
    }
};

Store.initializedProviders = Object.create(null);

 Store.initializeProviders = function(configuration,callback){
    var providerName = "MEMORY";

    if (configuration.providerName) {
        providerName = configuration.providerName;
    }

    var storeClients = configuration.storeClients ? configuration.storeClients :  ["unavailable"];

    logger.debug('Initializing clients',providerName);
    initializeStoreClients(providerName, storeClients, function (err, providers) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, providers);
        }
    });
 }

 function initializeStoreClients(providerName, storeClients, callback) {
    var providers = [];
    var initializedClients = 0;
    var providersInitializationBuffer = new Array(storeClients.length);

    for(var storeClientIndex = 0; storeClientIndex < storeClients.length; storeClientIndex++){
        var storeClient = storeClients[storeClientIndex];
        storeClient.initializationIndex = storeClientIndex;
        initializeStoreProviders(providerName,storeClient,function(initializedProviders,initializationIndex){
            providersInitializationBuffer[initializationIndex] = initializedProviders;
            initializedClients++;

            if(initializedClients == storeClients.length){
                for(var providerBuffer in providersInitializationBuffer){
                    providers = providers.concat(providersInitializationBuffer[providerBuffer]);
                }

                callback(null,providers);
            }
        });
    }
};

function initializeStoreProviders(providerName, storeClient, callback) {
    logger.debug('Initializing client',storeClient);
    var providers = storeClient.unique ? null : Store.initializedProviders[JSON.stringify(storeClient)];

    if(providers){
        callback(providers);
    }else{
        providers = createStoreProviderInstances(providerName,storeClient);
        var initializedProvidersCounter = 0;

        if(!storeClient.unique){
            Store.initializedProviders[JSON.stringify(storeClient)] = providers;
        }

        for(var providersIndex = 0; providersIndex < providers.length; providersIndex++){
            var provider = providers[providersIndex];
            provider.initialize(function (err, success) {
                initializedProvidersCounter++;
                if (initializedProvidersCounter === providers.length) {

                    callback(providers,storeClient.initializationIndex);
                }
            });
        }
    }
};

function createStoreProviderInstances(providerName, storeClient) {
    var result = [];
    switch (providerName) {
        case "REDIS":
            logger.debug("Creating Redis store provider.");
            var RedisStore = require('./provider/store-provider-redis.js');
            for(var portIndex = 0;portIndex < storeClient.ports.length; portIndex++){
                var port = storeClient.ports[portIndex];
                result.push(new RedisStore({
                    'REDIS_HOST': storeClient.host,
                    'REDIS_PORT': port,
                    'REDIS_PASSWORD': storeClient.password,
                    'REDIS_DATABASE': storeClient.database
                }));
            }
            break;
        case "MEMORY":
            var MemoryStore = require('./provider/store-provider-memory.js');
            result.push(new MemoryStore());
            break;
        case "MONGO":
                logger.warn('There is no store provider for \'' + providerName + '\'');
                break;
        default:
            logger.warn('There is no store provider for \'' + providerName + '\'');
            break;
    }
    return result;
};
