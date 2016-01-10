var vows = require('vows'),
  configuration = require('../config-test.js'),
  events = require('events'),
  url = require('url');


var suite = vows.describe('Test charge route');


suite.addBatch({
  '/isValid with wrong applictionKey': {
    topic: function() {

      var emitter = new(events.EventEmitter);

      var _route = "/isValid";
      var postData = {
        ApplicationKey: configuration.isValid.unexistentKey.applicationKey,
        PrivateKey: configuration.isValid.unexistentKey.privateKey
      }

      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: configuration.ortc_server.url + _route
      }

      request.post(options, function(err, httpResponse, body) {
        if (err) {
          emitter.emit('error', err)
        } else {
          emitter.emit('success', httpResponse)
        }

      });

      return emitter;
    },

    'with error': function(err, stat) {
      assert.isNull(err);
    },
    'with success': function(err, stat) {
      assert.equal(stat.statusCode, 401);
    }
  }

});
