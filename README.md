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

var fields = select.include(['name', 'email', 'children.name']);

console.log(fields); // { "name": false, "email": false, "children.name": false };
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

### Chaninig
``` JavaScript
var select = require('mongo-select');

var projection = select.noId().exclude(["name", "email", "children.name"]);

console.log(projection); // { "_id": false, "name": false, "email": false, "children.name": false };
```