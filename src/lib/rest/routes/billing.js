var express = require('express'),
  router = express.Router(),
  async = require("async"),
  BillingLib = require("../../bussiness/billing.js"),
  ChargeInput = require('../../data/contracts/input/charge.js'),
  ListInput = require('../../data/contracts/input/list.js'),
  ChargeOuput = require('../../data/contracts/output/charge.js'),
  ListOuput = require('../../data/contracts/output/list.js'),
  bodyParser = require('body-parser');


router.get('/', function(req, res) {
  res.send(200, "WELCOME TO BILLING API");
});

/**
  Action method for charge rote
  1. validate the input paramteres
  2. call bussiness logic for charge
  3. create output object to be sent back
**/
router.post('/charge', function(req, res) {

  async.waterfall([
    function(callback) {
      var chargeData = new ChargeInput(req.body);
      chargeData.validate(function(err) {
        callback(err, chargeData);
      });
    },
    function(chargeData, callback) {
      BillingLib.charge(chargeData.input, function(err, data) {
        callback(err, data);
      });
    }
  ], function(err, data) {
    var chargeOuput = new ChargeOuput(err, data);
    res.status(chargeOuput.statusCode).send(chargeOuput.output);
  });

});

/**
  Action method for list rote
  1. validate the input paramteres
  2. call bussiness logic for list
  3. create output object to be sent back
**/
router.get('/list/:account_name', function(req, res) {
  async.waterfall([
    function(callback) {
      var listInput = new ListInput({
        account_name: req.param('account_name')
      });
      listInput.validate(function(err) {
        callback(err, listInput);
      });
    },
    function(listInput, callback) {
      BillingLib.list(listInput.input, function(err, data) {
        callback(err, data);
      });
    }
  ], function(err, data) {
    var listOut = new ListOuput(err, data);
    res.status(listOut.statusCode).send(listOut.output);
  });
});


module.exports = router;
