var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
var db = require('monk')('localhost/mydb');

function doIt () {
  var users = db.get('users');
  users.insert({ name: 'test' }).on('success', function (doc) {
    console.log('sucess added user');
  });

  users.insert({ name: 'Tobi 2 ', desc: 'one more things'}, function () {
    console.log('insert user 2 ');
  });

  console.log(db.get('users'));

}

var insertDocument = function (db, callback) {
  db.collection('users').insertOne({
    'address': {
      'street': '2 Avenue',
      'zipcode': '10075',
      'building': '1480',
      'coord': [ -73.9557413, 40.7720266 ]
    },
    'borough': 'Manhattan',
    'cuisine': 'Italian',
    'grades': [
      {
        'date': new Date('2014-10-01T00:00:00Z'),
        'grade': 'A',
        'score': 11
      },
      {
        'date': new Date('2014-01-16T00:00:00Z'),
        'grade': 'B',
        'score': 17
      }
    ],
    'name': 'Vella',
    'restaurant_id': '41704620'
  }, function (err, result) {
    assert.equal(err, null);
    console.log('Inserted a document into the restaurants collection.');
    callback(result);
  });
};

MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  insertDocument(db, function () {
    db.close();
  });
});

function selectUsers () {
  var users = db.get('users');
  users.find({}, function (err, docs) {
    console.log(docs);
  });

}

selectUsers();

doIt();
