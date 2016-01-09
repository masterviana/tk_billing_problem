
var input = function(){
  var input =  {}
  input.account_name = (typeof data.account_name != 'undefined' && typeof data.account_name == "string") ? data.account_name : "";

  this.input = input;
}

input.prototype.validate = function(callback){
  if(this.input.account_name == ""){
    callback("you sould supply account name");
  }else{
    callback();
  }
}

exports = module.exports = input;
