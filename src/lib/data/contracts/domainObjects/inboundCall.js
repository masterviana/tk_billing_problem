

var inboundCall = function(data){

  this.tableTemplate = "TD_CALLS";
  this.type = "INBOUND";

  this.duration = data.call_duration;
  this.account_name = data.account_name;
  this.call_cost = data.call_cost;
  this.talkdesk_phone_number = data.talkdesk_phone_number;
  this.forwarded_phone_number = data.forwarded_phone_number;
  this.forwarded_phone_number = data.forwarded_phone_number;
  this.call_id = data.call_id;
  this.timestamp = +new Date();


}

inboundCall.prototype.generateId = function(){

}

inboundCall.prototype.adjustToProdiver = function(){

}
