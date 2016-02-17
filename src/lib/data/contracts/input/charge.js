var input = function (data) {
  var input = {};
  input.call_duration = (typeof data.call_duration != 'undefined' && typeof data.call_duration == 'string') ? data.call_duration : '';
  input.account_name = (typeof data.account_name != 'undefined' && typeof data.account_name == 'string') ? data.account_name : '';
  input.call_id = (typeof data.call_id != 'undefined' && typeof data.call_id == 'string') ? data.call_id : '';
  input.talkdesk_phone_number = (typeof data.talkdesk_phone_number != 'undefined' && typeof data.talkdesk_phone_number == 'string') ? data.talkdesk_phone_number : '';
  input.customer_phone_number = (typeof data.customer_phone_number != 'undefined' && typeof data.customer_phone_number == 'string') ? data.customer_phone_number : '';
  input.forwarded_phone_number = (typeof data.forwarded_phone_number != 'undefined' && typeof data.forwarded_phone_number == 'string') ? data.forwarded_phone_number : '';

  this.input = input;

};

input.prototype.validate = function (callback) {
  if (this.input.call_duration == '') {
    callback('Should supply call duration');
  }else if (this.input.account_name == '') {
    callback('Should supply account name');
  }else if (this.input.talkdesk_phone_number == '') {
    callback('Should supply talkdesk phone number');
  }else if (this.input.customer_phone_number == '') {
    callback('Should supply customer phone number');
  } else {
    callback();
  }
};

exports = module.exports = input;
