var EventManger = require("../utils/event-manager.js"),
  utils = require('../utils/utils.js'),
  async = require("async"),
  billingData = require('../data/billing-data.js'),
  Logger = require('../utils/logger/logger.js');


var ADD_CALL_CHARGE_TO_PROFILE = "evt_ADD_CALL_CHARGE_TO_PROFILE"

var Billing = function() {

  this.logger = new Logger();
  this.logger.setContext('Billing Bussiness');

  EventManger.subscribe(ADD_CALL_CHARGE_TO_PROFILE, this.addCallChargeToClientProfile.bind(this));
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
      function(talkdesk_phone_number_info, forwarded_phone_number_info, callback) {
        self.applyFormulaCalculationForTotalCharge(input,
           talkdesk_phone_number_info,
           forwarded_phone_number_info,
           function(err, data) {
             self.logger.debug("back from charge calculations ", data);
             if(err){
               callback(err,null);
             }else{
               callback(null,data);
             }
           });

      }
    ], function(err, data) {
      callback(err, data);
    });

  },
  list: function(input, callback) {

  },
  applyFormulaCalculationForTotalCharge: function(input, talkdesk_phone_number_info, forwarded_phone_number_info, callback) {
    var self = this;

    self.logger.debug("talkDeskInfo ",talkdesk_phone_number_info, " forwardNumberInfo ",forwarded_phone_number_info );

    async.waterfall([
      function(callback) {
        self.talkDeskNumberPricePerMinute(input, talkdesk_phone_number_info, function(err, talkDeskPpm) {
          callback(err, talkDeskPpm);
        });
      },
      function(talkDeskPpm, callback) {
        self.externalNumberPricePerMinute(input, forwarded_phone_number_info, function(err, forwardNumberPpm) {
          callback(err, talkDeskPpm, forwardNumberPpm);
        });
      },
      function(talkDeskPpm, forwardNumberPpm, callback) {
        self.caculateProfitMargin(input, function(err, profitMargin) {
          callback(err, talkDeskPpm, forwardNumberPpm, profitMargin);
        });
      },
      function(talkDeskPpm, forwardNumberPpm, profitMargin, callback) {

        var duration = parseFloat(input.call_duration);
        var minutes = parseFloat(duration / 60).toFixed(2);

        self.logger.debug("FORMULA : talkDeskCost ",talkDeskPpm," forwardNumber Cost ",forwardNumberPpm," profit margin " ,profitMargin , " duration (secs) ",duration, " minutes ",minutes );
        var callTotalChargeIs = parseFloat(talkDeskPpm + forwardNumberPpm + profitMargin) * minutes
        self.logger.warn("Price to be charge for this call is ", callTotalChargeIs);
        EventManger.publish(ADD_CALL_CHARGE_TO_PROFILE, input, callTotalChargeIs);
        callback(null, callTotalChargeIs);
      }

    ], function(err, data) {
      callback(err, data);
    });

  },
  addCallChargeToClientProfile: function(input, totalCharge) {

  },
  talkDeskNumberPricePerMinute:function(input, talkdesk_phone_number_info, callback) {

    if (talkdesk_phone_number_info.country.indexOf("United States") != -1) {
      this.logger.debug("will apply United States tax for talkdeskNumber");
      callback(null, GLOBAL.billingEx.configuration.TALKDESK_SPECIAL_PRICES.US)
    } else if (talkdesk_phone_number_info.country.indexOf("United Kingdom") != -1) {
      this.logger.debug("will apply United Kingdom tax for talkdeskNumber");
      callback(null, GLOBAL.billingEx.configuration.TALKDESK_SPECIAL_PRICES.UK)
    } else {
      callback(null, GLOBAL.billingEx.configuration.TALKDESK_SPECIAL_PRICES.DEFAULT_TALKDESK_MARGIN)
    }
  },
  externalNumberPricePerMinute: function(input, forwarded_phone_number_info, callback) {
    if (input.forwarded_phone_number == "") {
      this.logger.debug("externalNumberPricePerMinute is ", GLOBAL.billingEx.configuration.TALKDESK_SPECIAL_PRICES.DEFAULT_INCOMING_BROWSER);
      callback(null, GLOBAL.billingEx.configuration.TALKDESK_SPECIAL_PRICES.DEFAULT_INCOMING_BROWSER );
    } else {
      this.logger.debug("externalNumberPricePerMinute is ", forwarded_phone_number_info.pricePerMinute);
      var pricePerMinute = parseFloat(forwarded_phone_number_info.pricePerMinute);
      callback(null, pricePerMinute);
    }
  },
  caculateProfitMargin:function(input, callback) {
    //Just need to get client profile to reajust the margin price based on minutes per mount
    //for now it's hardcode on 0.05
    var profitMargin = GLOBAL.billingEx.configuration.TALKDESK_SPECIAL_PRICES.DEFAULT_PROFIT_MARGIN;
    callback(null, profitMargin);
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
          var checkExit = infoCountry != null || length <= 0;
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
