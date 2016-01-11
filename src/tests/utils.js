


this.getTestDataById = function(dataCollection, key){


  var data = null

  for(var i in dataCollection){
      if(dataCollection[i].callId == key){
        data = dataCollection[i]
        break;
      }
  }
  return data;
}
