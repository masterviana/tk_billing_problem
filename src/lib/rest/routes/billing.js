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

router.post('/charge', function(req, res) {

  async.waterfall([
    function(callback) {
      var chargeData = new ChargeInput(req.body);
      chargeData.validate(function(err) {
        callback(err, chargeData);
      });
    },
    function(chargeData, callback) {
      BillingLib.charge(chargeData.input, function(err,data){

        callback(err,data);
      });
    }
  ], function(err, data) {

    console.log("data is ", data)
    var chargeOuput = new ChargeOuput(err, data);
    res.send(chargeOuput.statusCode, chargeOuput.output);
  });

});

router.get('/list/:account_name', function(req, res) {
  res.send(200, "WELCOME TO BILLING API");
});


module.exports = router;
