var vows = require('vows'),
  configuration = require('../config/config-ci.js'),
  events = require('events'),
  utils = require('../utils.js'),
  async = require('async'),
  request = require('request'),
  assert = require('assert'),
  url = require('url');

var suite = vows.describe('Test charge route from positive, the result should be real prices');

var localCost = 0;

suite.addBatch({
  '/charge route test talkdesk_number from UK without forwarded_phone_number': {
    topic: function () {
      var emitter = new (events.EventEmitter);
      var baseUrl = configuration.baseUrl;
      var _accountName = configuration.account_name;
      var _keyTest = '00000001';

      var _data = utils.getTestDataById(configuration.calls, _keyTest);
      var _route = '/charge';

      var postData = {
        call_duration: _data.duration,
        account_name: _accountName,
        call_id: _keyTest,
        talkdesk_phone_number: _data.talkdesk_number,
        customer_phone_number: _data.customer_phone_number,
        forwarded_phone_number: _data.forwarded_phone_number
      };

      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: baseUrl + _route
      };

      async.waterfall([
        function (callback) {
          if (_data) {
            callback();
          } else {
            callback('no data available for test');
          }
        },
        function (callback) {
          request.post(options, function (err, httpResponse, body) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, body);
            }
          });
        },
        function (body, callback) {
          // Calculate the formula locally based on config parameters
          var duration = parseFloat(_data.duration);
          var minutes = parseFloat(duration / 60).toFixed(2);
          localCost = _data.manualCalculationCost.talkdesk_number_cost + _data.manualCalculationCost.forwarded_phone_number + _data.manualCalculationCost.profit;
          localCost = localCost * minutes;
          callback(null, body.data);
        }
      ], function (err, data) {
        if (err) {
          emitter.emit('error', err);
        } else {
          emitter.emit('success', data);        }
      });

      return emitter;
    },

    'with error': function (err, stat) {
      assert.isNull(err);
    },
    'with success': function (err, apiCost) {
      assert.equal(apiCost, localCost);
    }
  }

});

suite.addBatch({
  '/charge route test talkdesk_number from UK with forwarded_phone_number from portugal': {
    topic: function () {
      var emitter = new (events.EventEmitter);
      var baseUrl = configuration.baseUrl;
      var _accountName = configuration.account_name;
      var _keyTest = '00000002';

      var _data = utils.getTestDataById(configuration.calls, _keyTest);
      var _route = '/charge';

      var postData = {
        call_duration: _data.duration,
        account_name: _accountName,
        call_id: _keyTest,
        talkdesk_phone_number: _data.talkdesk_number,
        customer_phone_number: _data.customer_phone_number,
        forwarded_phone_number: _data.forwarded_phone_number
      };

      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: baseUrl + _route
      };

      async.waterfall([
        function (callback) {
          if (_data) {
            callback();
          } else {
            callback('no data available for test');
          }
        },
        function (callback) {
          request.post(options, function (err, httpResponse, body) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, body);
            }
          });
        },
        function (body, callback) {
          // Calculate the formula locally based on config parameters
          var duration = parseFloat(_data.duration);
          var minutes = parseFloat(duration / 60).toFixed(2);
          localCost = _data.manualCalculationCost.talkdesk_number_cost + _data.manualCalculationCost.forwarded_phone_number + _data.manualCalculationCost.profit;
          localCost = localCost * minutes;
          callback(null, body.data);
        }
      ], function (err, data) {
        if (err) {
          emitter.emit('error', err);
        } else {
          emitter.emit('success', data);        }
      });

      return emitter;
    },

    'with error': function (err, stat) {
      assert.isNull(err);
    },
    'with success': function (err, apiCost) {
      assert.equal(apiCost, localCost);
    }
  }

});

suite.addBatch({
  '/charge route test talkdesk_number from US without forwarded_phone_number': {
    topic: function () {
      var emitter = new (events.EventEmitter);
      var baseUrl = configuration.baseUrl;
      var _accountName = configuration.account_name;
      var _keyTest = '00000003';

      var _data = utils.getTestDataById(configuration.calls, _keyTest);
      var _route = '/charge';

      var postData = {
        call_duration: _data.duration,
        account_name: _accountName,
        call_id: _keyTest,
        talkdesk_phone_number: _data.talkdesk_number,
        customer_phone_number: _data.customer_phone_number,
        forwarded_phone_number: _data.forwarded_phone_number
      };

      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: baseUrl + _route
      };

      async.waterfall([
        function (callback) {
          if (_data) {
            callback();
          } else {
            callback('no data available for test');
          }
        },
        function (callback) {
          request.post(options, function (err, httpResponse, body) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, body);
            }
          });
        },
        function (body, callback) {
          // Calculate the formula locally based on config parameters
          var duration = parseFloat(_data.duration);
          var minutes = parseFloat(duration / 60).toFixed(2);
          localCost = _data.manualCalculationCost.talkdesk_number_cost + _data.manualCalculationCost.forwarded_phone_number + _data.manualCalculationCost.profit;
          localCost = localCost * minutes;
          callback(null, body.data);
        }
      ], function (err, data) {
        if (err) {
          emitter.emit('error', err);
        } else {
          emitter.emit('success', data);        }
      });

      return emitter;
    },

    'with error': function (err, stat) {
      assert.isNull(err);
    },
    'with success': function (err, apiCost) {
      assert.equal(apiCost, localCost);
    }
  }

});

suite.addBatch({
  '/charge route test talkdesk_number from US with forwarded_phone_number from Vietnam': {
    topic: function () {
      var emitter = new (events.EventEmitter);
      var baseUrl = configuration.baseUrl;
      var _accountName = configuration.account_name;
      var _keyTest = '00000004';

      var _data = utils.getTestDataById(configuration.calls, _keyTest);
      var _route = '/charge';

      var postData = {
        call_duration: _data.duration,
        account_name: _accountName,
        call_id: _keyTest,
        talkdesk_phone_number: _data.talkdesk_number,
        customer_phone_number: _data.customer_phone_number,
        forwarded_phone_number: _data.forwarded_phone_number
      };

      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: baseUrl + _route
      };

      async.waterfall([
        function (callback) {
          if (_data) {
            callback();
          } else {
            callback('no data available for test');
          }
        },
        function (callback) {
          request.post(options, function (err, httpResponse, body) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, body);
            }
          });
        },
        function (body, callback) {
          // Calculate the formula locally based on config parameters
          var duration = parseFloat(_data.duration);
          var minutes = parseFloat(duration / 60).toFixed(2);
          localCost = _data.manualCalculationCost.talkdesk_number_cost + _data.manualCalculationCost.forwarded_phone_number + _data.manualCalculationCost.profit;
          localCost = localCost * minutes;
          callback(null, body.data);
        }
      ], function (err, data) {
        if (err) {
          emitter.emit('error', err);
        } else {
          emitter.emit('success', data);        }
      });

      return emitter;
    },

    'with error': function (err, stat) {
      assert.isNull(err);
    },
    'with success': function (err, apiCost) {
      assert.equal(apiCost, localCost);
    }
  }

});

suite.addBatch({
  '/charge route test talkdesk_number from taiwan without forwarded_phone_number': {
    topic: function () {
      var emitter = new (events.EventEmitter);
      var baseUrl = configuration.baseUrl;
      var _accountName = configuration.account_name;
      var _keyTest = '00000005';

      var _data = utils.getTestDataById(configuration.calls, _keyTest);
      var _route = '/charge';

      var postData = {
        call_duration: _data.duration,
        account_name: _accountName,
        call_id: _keyTest,
        talkdesk_phone_number: _data.talkdesk_number,
        customer_phone_number: _data.customer_phone_number,
        forwarded_phone_number: _data.forwarded_phone_number
      };

      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: baseUrl + _route
      };

      async.waterfall([
        function (callback) {
          if (_data) {
            callback();
          } else {
            callback('no data available for test');
          }
        },
        function (callback) {
          request.post(options, function (err, httpResponse, body) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, body);
            }
          });
        },
        function (body, callback) {
          // Calculate the formula locally based on config parameters
          var duration = parseFloat(_data.duration);
          var minutes = parseFloat(duration / 60).toFixed(2);
          localCost = _data.manualCalculationCost.talkdesk_number_cost + _data.manualCalculationCost.forwarded_phone_number + _data.manualCalculationCost.profit;
          localCost = localCost * minutes;
          callback(null, body.data);
        }
      ], function (err, data) {
        if (err) {
          emitter.emit('error', err);
        } else {
          emitter.emit('success', data);        }
      });

      return emitter;
    },

    'with error': function (err, stat) {
      assert.isNull(err);
    },
    'with success': function (err, apiCost) {
      assert.equal(apiCost, localCost);
    }
  }

});

suite.addBatch({
  '/charge route test talkdesk_number from taiwan with forwarded_phone_number from Trinidad and Tobago': {
    topic: function () {
      var emitter = new (events.EventEmitter);
      var baseUrl = configuration.baseUrl;
      var _accountName = configuration.account_name;
      var _keyTest = '00000006';

      var _data = utils.getTestDataById(configuration.calls, _keyTest);
      var _route = '/charge';

      var postData = {
        call_duration: _data.duration,
        account_name: _accountName,
        call_id: _keyTest,
        talkdesk_phone_number: _data.talkdesk_number,
        customer_phone_number: _data.customer_phone_number,
        forwarded_phone_number: _data.forwarded_phone_number
      };

      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: baseUrl + _route
      };

      async.waterfall([
        function (callback) {
          if (_data) {
            callback();
          } else {
            callback('no data available for test');
          }
        },
        function (callback) {
          request.post(options, function (err, httpResponse, body) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, body);
            }
          });
        },
        function (body, callback) {
          // Calculate the formula locally based on config parameters
          var duration = parseFloat(_data.duration);
          var minutes = parseFloat(duration / 60).toFixed(2);
          localCost = _data.manualCalculationCost.talkdesk_number_cost + _data.manualCalculationCost.forwarded_phone_number + _data.manualCalculationCost.profit;
          localCost = localCost * minutes;
          callback(null, body.data);
        }
      ], function (err, data) {
        if (err) {
          emitter.emit('error', err);
        } else {
          emitter.emit('success', data);        }
      });

      return emitter;
    },

    'with error': function (err, stat) {
      assert.isNull(err);
    },
    'with success': function (err, apiCost) {
      assert.equal(apiCost, localCost);
    }
  }

});

suite.export(module);
