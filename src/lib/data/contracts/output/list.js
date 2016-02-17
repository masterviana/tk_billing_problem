var output = function (err, data) {
  var output = {

  };
  var statusCode = 0;
  if (err) {
    statusCode = 500;
    output.error = err;
    output.data = null;
  } else {
    var items = [];
    for (var key in data) {
      items.push(JSON.parse(data[key]));
    }

    statusCode = 200;
    output.error = null;
    output.data = items;
  }

  this.statusCode = statusCode;
  this.output = output;

};

exports = module.exports = output;
