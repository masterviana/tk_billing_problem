/**
 * Domain object to represent call register on database
 */
var inboundCall = function (data) {
  var objectData = {};
  objectData.type = 'INBOUND';
  objectData.call_duration = data.call_duration;
  objectData.account_name = data.account_name;
  objectData.call_cost = data.call_cost;
  objectData.talkdesk_phone_number = data.talkdesk_phone_number;
  objectData.forwarded_phone_number = data.forwarded_phone_number;
  objectData.forwarded_phone_number = data.forwarded_phone_number;
  objectData.call_id = data.call_id;
  objectData.timestamp = +new Date();

  this.data = objectData;
};

inboundCall.prototype.generateId = function () {};

inboundCall.prototype.adjustToProdiver = function () {
  var entry = {
    key: this.data.account_name,
    field: this.data.call_id,
    value: JSON.stringify(this.data)
  };
  return entry;
};

inboundCall.prototype.adjustToMongo = function () {
  var entry = {
    key: this.data.account_name,
    field: this.data.call_id,
    value: JSON.stringify(this.data)
  };
  return entry;
};

exports = module.exports = inboundCall;
