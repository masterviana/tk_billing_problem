var bodyParser = require('body-parser');


// server/router/index.js
module.exports = function(app) {

  //for loggin all request routs
  app.use(function(req, res, next) {
    console.log("route : ", req.url);
    next();
  });

  app.use(bodyParser.json()); // for parsing application/json

  app.use('/' +  GLOBAL.billingEx.configuration.VERSION + '/billing', require('./billing'));
};
