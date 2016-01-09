var EventManger = require("../utils/event-manager.js"),
  utils = require('../utils/utils.js'),
  async = require("async"),
  billingData = require('../data/billing-data.js'),
  Logger = require('../utils/logger/logger.js');


var Billing = function() {

  this.logger = new Logger();
  this.logger.setContext('Billing Bussiness');
}

Billing.instance = null;
Billing.getInstance = function() {
  if (this.instance === null) {
    this.instance = new Billing();
  }
  return this.instance;
};


Billing.prototype = {

  charge: function(input, callback) {
    var self = this;

    async.waterfall([
      function(callback) {
        self.getPriceAndCountryOfNumber(input.talkdesk_phone_number,
          function(err, data) {
            callback(err, data);
          });
      },
      function(talkdesk_phone_number_info, callback) {
        if (input.forwarded_phone_number) {
          self.getPriceAndCountryOfNumber(input.forwarded_phone_number,
            function(err, data) {
              callback(err, talkdesk_phone_number_info, data);
            });
        } else {
          callback(null, talkdesk_phone_number_info, null);
        }
      },
      function(talkdesk_phone_number_info, forwarded_phone_number, callback) {



      }
    ], function(err, data) {
      callback(err, data);
    });

  },
  list: function(input, callback) {

  },
  getPriceAndCountryOfNumber: function(number, callback) {
    var self = this;

    number = number.replace(/[+_]/g, '');
    self.logger.debug("will get country information of number ", number);

    if (!number || number.length == 1) {
      callback("Number is not valid to check ", null);
    } else {
      var length = number.length;
      var infoCountry = null;
      var checkingKey = number;

      async.until(
        function() {
          var checkExit = infoCountry != null || length <= 0
          console.log("call return func length ", length, " condition ", checkExit)
          return checkExit;
        },
        function(cb) {
          checkingKey = checkingKey.substring(0, length);
          self.logger.debug("will check if ", checkingKey, " are present on redis");
          billingData.getKeyFromRedis(checkingKey, function(err, data) {
            length--;
            if (data) {
              self.logger.debug("succesfully getting from redis key ", checkingKey, " data ", data);
              infoCountry = data;
            }
            cb();
          });
        },
        function(err, number) {
          if (infoCountry) {
            callback(null, JSON.parse(infoCountry));
          } else {
            self.logger.error("No key are available for number " + number);
            callback("No key are available for number " + number, null);
          }
        }
      );
    }
  }

}


exports = module.exports = Billing.getInstance();
