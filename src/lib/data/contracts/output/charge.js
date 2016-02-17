var output = function (err, data) {
  var output = {

  };
  var statusCode = 0;
  if (err) {
    statusCode = 500;
    output.error = err;
    output.data = null;
  } else {
    statusCode = 200;
    output.error = null;
    output.data = data;
  }

  this.statusCode = statusCode;
  this.output = output;

};

exports = module.exports = output;
