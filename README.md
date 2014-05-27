mongo-select
========
Module to help create projection objects when working with mongodb.

Installing
------------
```Shell
npm install mongo-select
```

Usage
------
### Including fields
``` JavaScript
var select = require('mongo-select');

var projection = select.include(['name', 'email', 'children.name']).make();

console.log(projection); // { "name": false, "email": false, "children.name": false };
```

### Excluding fields
``` JavaScript
var select = require('mongo-select');

var projection = select.exclude(['name', 'email', 'children.name']);

console.log(projection); // { "name": false, "email": false, "children.name": false };
```

### Excluding _id
``` JavaScript
var select = require('mongo-select');

var projection = select.noId();

console.log(projection); // { "_id": false };
```

### Chaining
To provide a fluent interface the chaining methods begin with `_`. Otherwise this might affect documents with fields named _exclude_, _include_, _noId_.
``` JavaScript
var select = require('mongo-select');

var projection = select.noId()._exclude(["name", "email", "children.name"]);

console.log(projection); // { "_id": false, "name": false, "email": false, "children.name": false };
```

``` JavaScript
var select = require('mongo-select');

var projection = select.`(["name", "email", "children.name"])._noId();

console.log(projection); // { "_id": false, "name": true, "email": true, "children.name": true };
```