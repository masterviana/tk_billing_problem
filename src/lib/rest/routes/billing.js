var express = require('express'),
router = express.Router(),
  bodyParser = require('body-parser');


router.get('/', function(req, res) {
  res.send(200, "WELCOME TO BILLING API");
});


module.exports = router;
