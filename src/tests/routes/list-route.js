var vows = require('vows'),
  configurationReal = require('../config/config-ci.js'),
  configurationMiscalculations = require('../config/config-miscalculations.js'),
  events = require('events'),
  utils = require('../utils.js'),
  async = require("async"),
  request = require('request'),
  assert = require('assert'),
  url = require('url');


var suite = vows.describe('Test List Route');

var totalItems = 0;

suite.addBatch({
  'try to get all items insert to test rote charge in a positive way': {
    topic: function() {

      var emitter = new(events.EventEmitter);
      var baseUrl = configurationReal.baseUrl;
      var _accountName = configurationReal.account_name;


      totalItems =  configurationReal.calls.length;
      var url = baseUrl + "/list/" + _accountName;


      async.waterfall([

        function(callback) {

          request({
            url: url
          }, function(err, httpResponse, body) {
            if (err) {
              callback(err, null);
            } else {
              callback(err, JSON.parse(httpResponse.body));
            }
          });

        },
        function(body, callback) {
          if(body && body.data){
            callback(null,body.data.length);
          }else {
            callback("no items are returned");
          }
        }
      ], function(err, data) {
        if (err) {
          emitter.emit("error", err);
        } else {
          emitter.emit("success", data);
        }
      });

      return emitter;
    },

    'with error': function(err, stat) {
      assert.isNull(err);
    },
    'with success': function(err, numberOfReturnedItems) {
      assert.equal(numberOfReturnedItems, totalItems);
    }
  }

});


suite.addBatch({
  'try to get all items insert to test rote charge with miscalculations': {
    topic: function() {

      var emitter = new(events.EventEmitter);
      var baseUrl = configurationMiscalculations.baseUrl;
      var _accountName = configurationMiscalculations.account_name;


      totalItems =  configurationMiscalculations.calls.length;
      var url = baseUrl + "/list/" + _accountName;


      async.waterfall([

        function(callback) {

          request({
            url: url
          }, function(err, httpResponse, body) {
            if (err) {
              callback(err, null);
            } else {
              callback(err, JSON.parse(httpResponse.body));
            }
          });

        },
        function(body, callback) {
          if(body && body.data){
            callback(null,body.data.length);
          }else {
            callback("no items are returned");
          }
        }
      ], function(err, data) {
        if (err) {
          emitter.emit("error", err);
        } else {
          emitter.emit("success", data);
        }
      });

      return emitter;
    },

    'with error': function(err, stat) {
      assert.isNull(err);
    },
    'with success': function(err, numberOfReturnedItems) {
      assert.equal(numberOfReturnedItems, totalItems);
    }
  }

});


suite.export(module);
