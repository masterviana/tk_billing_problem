

function is_numeric(n){
    return /^\d+$/.test(n) || !isNaN(n) && n.toString().indexOf('.') != -1;
}


function test(){

  console.log(is_numeric("0.987") )
  console.log(is_numeric("123"))
  console.log(is_numeric("vitor"))


}


test();
