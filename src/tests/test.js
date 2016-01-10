

function is_numeric(n){
    return /^\d+$/.test(n) || !isNaN(n) && n.toString().indexOf('.') != -1;
}


function test(){

  var n = (0.03 + 0.01 + 0.05) * 1.52

  console.log(n);


}


test();
