var Logger = require('../lib/utils/logger/logger.js'),
  BillingData = require('../lib/data/billing-data.js'),
  EtlProcess = require('../lib/bussiness/etl.js'),
  Configuration = require('../lib/utils/configuration-multi-file/configuration-multi-file.js');

function start(err, data) {
  logger = new Logger();
  if (err) {
    logger.error(err);
    process.exit(1);
  } else {

    logger.setContext("Initialize server");

    GLOBAL.billingEx = Object.create(null);
    GLOBAL.billingEx.configuration = data;


    if (data.LOG_LEVEL) {
      GLOBAL.billingEx.configuration.LOG_LEVEL = data.LOG_LEVEL;
    }

    if (data.PORT) {
      GLOBAL.billingEx.configuration.PORT = data.PORT;
    }

    if (data.VERSION) {
      GLOBAL.billingEx.configuration.VERSION = data.VERSION;
    }

    logger.setLevel(GLOBAL.billingEx.configuration.LOG_LEVEL);

    logger.debug("will Initializate billing data");

    //Initializate data providers
    BillingData.initialize(data, function() {
      logger.debug("billing data initializate");

      EtlProcess.processFile(function(err, data) {

        var app = require('../lib/rest/rest-server');
        app.set('port', process.env.PORT || GLOBAL.billingEx.configuration.PORT);

        var server = app.listen(app.get('port'), function() {
          logger.warn("server is running on port " + server.address().port)
        });
      });

    });

  }
}

var options = [{
  'short': 'v',
  'long': 'VERSION',
  'description': 'Show current tag and exit.',
  callback: function() {
    Git.currentTag(
      __dirname,
      function(tag) {
        logger.info("Tag:", tag);
        process.exit(0);
      },
      function(error) {
        logger.error(error);
        process.exit(1);
      }
    )
  }
}, {
  'short': 'l',
  'long': 'LOG_LEVEL',
  'description': 'The application logger level.',
  'value': true,
  'required': false
}, {
  'short': 'p',
  'long': 'PORT',
  'description': 'The http port.',
  'value': true,
  'required': false
}, {
  'short': 'e',
  'long': 'configuration',
  'description': 'The server environment: PRODUCTION, STAGING, DEVELOPMENT.',
  'value': true,
  'required': false
}, {
  'short': 'rts',
  'long': 'REALTIME_STORAGE',
  'description': 'Realtime Storage credentials in the form: { "APPLICATION_KEY" : "ENVIRONMENT_APPLICATION_KEY", "PRIVATE_KEY" : "ENVIRONMENT_PRIVATE_KEY" }',
  'value': true,
  'required': false
}];

Configuration.getOptParams(options, function(opt) {
  Configuration.loadFromFile(opt, start);
});
