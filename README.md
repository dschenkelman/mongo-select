mongo-select
========
Module to help create projection objects when working with mongodb.

Installing
------------
```Shell
npm install mongo-select
```

Introduction
---------
``` JavaScript
var select = require('mongo-select').select();
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  if(err) throw err;

  var users = db.collection('users');
  scripts = users.find({}, select.include(['name', 'email']), 
    function(err, result){
      // code here, access to only result[i]._id, result[i].name and result[i].email
    });
});
```

Examples
----------
### Including fields
``` JavaScript
var select = require('mongo-select').select();

var projection = select.include(['name', 'email', 'children.name']);

console.log(projection); // { 'name': true, 'email': true, 'children.name': true };
```

### Excluding fields
``` JavaScript
var select = require('mongo-select').select();

var projection = select.exclude(['name', 'email', 'children.name']);

console.log(projection); // { 'name': false, 'email': false, 'children.name': false };
```

### Excluding _id
``` JavaScript
var select = require('mongo-select').select();

var projection = select.noId();

console.log(projection); // { '_id': false };
```

### Chaining
To provide a fluent interface the chaining methods begin with `_`. Otherwise this might affect documents with fields named _exclude_, _include_, _noId_.
``` JavaScript
var select = require('mongo-select').select();

var projection = select.noId()._exclude(['name', 'email', 'children.name']);

console.log(projection); // { '_id': false, 'name': false, 'email': false, 'children.name': false };
```

``` JavaScript
var select = require('mongo-select').select();

var projection = select.include(['name', 'email', 'children.name'])._noId();

console.log(projection); // { '_id': false, 'name': true, 'email': true, 'children.name': true };
```

### Permanent exclusion/inclusion
Sometimes it is important to always exclude or include a set of fields. That means that if they are permanently excluded and then specifically included they won't make it into the projection and viceversa:

``` JavaScript
var select = require('mongo-select').select();

select.exclude(['name', 'email', 'children.name'])._always();

var exclusion = select.exclude(['address']);

console.log(exclusion); // { 'name': false, 'email': false, 'children.name': false };

var inclusion = select.include(['name', 'email']);

console.log(inclusion); // { 'children.name': true };
```
To clear permanent registrations simply
``` JavaScript
select.clear();
```

Contributing
---------
Pull requests and issues are more than welcome. When submitting a PR make sure to run the tests:
``` Shell
npm test
```
