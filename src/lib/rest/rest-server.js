var express = require('express')

var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// var router = express.Router();
var router = require('./routes')(app);

// Error Handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
