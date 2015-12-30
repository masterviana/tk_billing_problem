var opts = require('opts'),
  fs = require('fs'),
  path = require('path'),
  Logger = require('../logger/logger.js'),
  Exception=require('./configuration-multi-file-exception-codes.js'),
  logger_ = new Logger();

this.loadConfig = function(options,callback){
  var self=this;
  self.getOptParams(options,function(opt){
    if(opt){
      self.loadFromFile(opt,callback);
    }
  });
}

this.loadFromFile = function(paramters, callback) {
  logger_.setLevel(3);
  logger_.setContext('Configuration');
  logger_.info("Loading configuration from file");
  var filePath = path.normalize(paramters.configuration.toString());
  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(err, data) {
        if (err) {
          callback(Exception["C1"],null);
        } else {
            try{
              data = JSON.parse(data.toString());
            }catch(e){
              callback(Exception["C3"],null);
            }
            for (var c in data) {
              var configValue = paramters[c];
              if (configValue != null) {
                data[c] = configValue;
              }
            }
            logger_.info("Configuration loaded from file");
            callback(null, data);
        }
      });
    } else {
      callback(Exception["C1"],null);
    }
  });
}

this.getOptParams = function(options, callback) {
  opts.parse(options, true);
  var r = {}
  for (var i in options) {
    if (typeof options[i].callback == 'undefined') {
      r[options[i].long] = opts.get(options[i].long);
    }
  };
  logger_.info("Configuration options loaded");
  callback(r);
};
