var bodyParser = require('body-parser');


// server/router/index.js
module.exports = function(app) {

  app.use(function(req, res, next) {
    console.log("route : ", req.url);
    next();
  });

  app.use(bodyParser.json()); // for parsing application/json

  //Load billing routes
  app.use('/' +  GLOBAL.billingEx.configuration.VERSION + '/billing', require('./billing'));
};
