'use strict';

/*jshint node:true */
/*global describe, it, beforeEach*/

require('should');
var select = require('../lib/index.js');

describe('include', function(){
  var fields;
  beforeEach(function() {
    fields = select.include(['email', 'name']);
  });
  it('should only have values', function(){
    Object.keys(fields).length.should.equal(2);
  });
	it('should set values to true', function(){
    fields.name.should.equal(true);
    fields.email.should.equal(true);
  });
});

describe('exclude', function(){
  var fields;
  beforeEach(function() {
    fields = select.exclude(['email', 'name']);
  });
  it('should only have values', function(){
    Object.keys(fields).length.should.equal(2);
  });
  it('should set values to false', function(){
    fields.name.should.equal(false);
    fields.email.should.equal(false);
  });
});

describe('noId', function(){
  var fields;
  beforeEach(function() {
    fields = select.noId();
  });
  it('should only have _id value', function(){
    Object.keys(fields).length.should.equal(1);
  });
  it('should set _id to false', function(){
    fields._id.should.equal(false);
  });
});