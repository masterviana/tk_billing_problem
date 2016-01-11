var EventManger = require("../utils/event-manager.js"),
  fs = require('fs'),
  utils = require('../utils/utils.js'),
  Logger = require('../utils/logger/logger.js'),
  billingData = require('../data/billing-data.js'),
  readline = require('readline');

var PROCESS_SET_OF_LINES_EVENT = "_processLines"
var INSERT_REDIS = "_INSERT_ON_REDIS"

/**
  This process will transform the data from twilio database file, in a format key:value format
  in order to turn the process of getting the country information based on begin of the number more quickly
**/


var etl = function() {
  this.priceDatabasePath = "lib/utils/db-prices/prices.txt";
  this.totalReadLines = 0;
  this.totalProcessedLines = 0;

  this.logger = new Logger();
  this.logger.setContext('ETL INSTANCE');

  EventManger.subscribe(PROCESS_SET_OF_LINES_EVENT, this.processFileLineHandler.bind(this));
  EventManger.subscribe(INSERT_REDIS, this.insertOnRedis.bind(this));
}

etl.instance = null;
etl.getInstance = function() {
  if (this.instance === null) {
    this.instance = new etl();
  }
  return this.instance;
};


etl.prototype = {
  /**
    Open file and read line by line
    For each read will fired and event to process the line
  **/
  processFile: function(callback) {
    var self = this;

    var rd = readline.createInterface({
      input: fs.createReadStream(this.priceDatabasePath),
      output: process.stdout,
      terminal: false
    });

    rd.on('line', function(line) {
      self.totalReadLines = self.totalReadLines + 1;
      EventManger.publish(PROCESS_SET_OF_LINES_EVENT, line);
    });

    rd.on('close', function(line) {
      if(self.totalReadLines != self.totalProcessedLines){
        self.logger.warn("number of lines on files is ", self.totalReadLines, " total processed lines ", self.totalProcessedLines," should be the same");
      }else{
        self.logger.info("all database are loaded on redis server ");
      }
      callback(null, "SETUP ALL PRICING DATA ON REDIS");
    });

  },
  /**
    Process each line of twilio database file
    transform the column that have the begin of phone number
    in a key of redis and the country and price information for number on a value
  **/
  processFileLineHandler: function(line) {
    var self = this;

    var splitResult = line.split(",");
    // self.logger.warn("split result is ", splitResult.length, " <> ", splitResult);

    if (splitResult.length < 3) {
      self.logger.error("Problem process database, any line must have at the format country, price, start number ", line);
    } else {
      var country = ""
      var pricePerMinute = ""
      var keys = []
      var len = splitResult.length;
      var firstNumber = false;

      for (var i = 0; i < len; i++) {
        var item =  splitResult[i];
        item = item.replace(/\"/g, '');
        item = item.trim();

        if (!utils.is_numeric(item)) {
          if (firstNumber) {
            self.logger.error("error processing line, must have number");
          } else {
            country +=  (country == "" ? "" : ", ") + item
          }
        } else {
          if (firstNumber == false) {
            pricePerMinute = item;
            firstNumber = true;
          } else {
            EventManger.publish(INSERT_REDIS,item,{country:country,pricePerMinute:pricePerMinute})
          }
        }
      }
      self.totalProcessedLines = self.totalProcessedLines + 1;
    }
  },
  /**
    Insert object with key and value on redis
  **/
  insertOnRedis : function(key,obj){
    var self = this;
    // self.logger.debug("will add key on redis key is ",key, " and object is ", JSON.stringify(obj));
    billingData.insertPricingKey(key,obj);
  }

}


exports = module.exports = etl.getInstance();
