var process = require('process');
// var db = require('monk')('localhost/test_db');

// var db = require('monk')('localhost:27017/db_test');

// var db = require('monk')('localhost:27017/db_test', {
//   username : 'admin',
//   password : 'ilovemongo_'
// });

var db = require('monk')('mongodb://vitor:vitor_@localhost:27017/test_db');
// {username:"vitor",password:"vitor_"}

// db.close();

function addItem () {
  var users = db.get('users');

  var item = {
    name: 'tiago',
    description: 'yes sir!',
    age: 18
  };

  var promise = users.insert(item);
  promise.on('complete', function (err, doc) {
    if (err) {
      console.log('error adding item ');
      console.log(err);
    } else {
      console.log('success adding document ');
      console.log(doc);
    }
  });

}

function findObj () {
  var promise = db.get('users').find({age: 25});
  promise.on('complete', function (err, doc) {
    if (err) {
      console.log('error gettinf item ');
      console.log(err);
    } else {
      console.log('success getting document ');
      console.log(doc);
    }
  });
  // var promise = db.get('users').find({_id : "56a12ca327edfb063eb44807"})
  // promise.on('complete', function(err, doc){
  //   if(err){
  //     console.log("error gettinf item ");
  //     console.log(err)
  //   }else{
  //     console.log("success getting document ")
  //     console.log(doc);
  //   }
  // });

}

function updateById () {
  var promise = db.get('users').updateById('56a12965b4075d1f27182124', {age: 31});

  promise.on('complete', function (err, doc) {
    if (err) {
      console.log('error update by id');
      console.log(err);
    } else {
      console.log('success updte byid document ');
      console.log(doc);
    }
  });
}

findObj();

// addItem()

// process.on('uncaughtException', function(err)
//  {
//       console.log('Caught exception: ' );
//       console.log(err);
// });
