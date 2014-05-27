'use strict';

/*jshint node:true */
/*global describe, it, beforeEach*/

require('should');
var select = require('../lib/index.js');

function getNonChainProperties(object){
  function isNotChainMethod(name){
      // remove initial _
      return Object.keys(select).indexOf(name.substring(1)) === -1 || (typeof object[name] !== 'function');
  }
  
  return Object.keys(object).filter(isNotChainMethod);
}

describe('include', function(){
  var projection;
  beforeEach(function() {
    projection = select.include(['email', 'name']);
  });
  it('should only have values', function(){
    getNonChainProperties(projection).length.should.equal(2);
  });
	it('should set values to true', function(){
    projection.name.should.equal(true);
    projection.email.should.equal(true);
  });
});

describe('exclude', function(){
  var projection;
  beforeEach(function() {
    projection = select.exclude(['email', 'name']);
  });
  it('should only have values', function(){
    getNonChainProperties(projection).length.should.equal(2);
  });
  it('should set values to false', function(){
    projection.name.should.equal(false);
    projection.email.should.equal(false);
  });
});

describe('noId', function(){
  var projection;
  beforeEach(function() {
    projection = select.noId();
  });
  it('should only have _id value', function(){
    getNonChainProperties(projection).length.should.equal(1);
  });
  it('should set _id to false', function(){
    projection._id.should.equal(false);
  });
});

describe('chaining', function(){
  describe('noId then exclude', function(){
    var projection;
    beforeEach(function() {
      projection = select.noId()._exclude(['email', 'children.name']);
    });
    it('should only have _id and excluded values', function(){
      getNonChainProperties(projection).length.should.equal(3);
    });
    it('should set all values to false', function(){
      projection._id.should.equal(false);
      projection.email.should.equal(false);
      projection['children.name'].should.equal(false);
    });
  });
  
  describe('noId then include', function(){
    var projection;
    beforeEach(function() {
      projection = select.noId()._include(['email', 'children.name']);
    });
    it('should only have _id and excluded values', function(){
      getNonChainProperties(projection).length.should.equal(3);
    });
    it('should set _id to false other values to true', function(){
      projection._id.should.equal(false);
      projection.email.should.equal(true);
      projection['children.name'].should.equal(true);
    });
  });
  
  describe('include then noId', function(){
    var projection;
    beforeEach(function() {
      projection = select.include(['email', 'children.name'])._noId();
    });
    it('should only have _id and excluded values', function(){
      getNonChainProperties(projection).length.should.equal(3);
    });
    it('should set _id to false other values to true', function(){
      projection._id.should.equal(false);
      projection.email.should.equal(true);
      projection['children.name'].should.equal(true);
    });
  });
  
  describe('include then noId', function(){
    var projection;
    beforeEach(function() {
      projection = select.include(['email', 'children.name'])._noId();
    });
    it('should only have _id and included values', function(){
      getNonChainProperties(projection).length.should.equal(3);
    });
    it('should set _id to false other values to true', function(){
      projection._id.should.equal(false);
      projection.email.should.equal(true);
      projection['children.name'].should.equal(true);
    });
  });
  
  describe('exclude then noId', function(){
    var projection;
    beforeEach(function() {
      projection = select.exclude(['email', 'children.name'])._noId();
    });
    it('should only have _id and excluded values', function(){
      getNonChainProperties(projection).length.should.equal(3);
    });
    it('should set all values to false', function(){
      projection._id.should.equal(false);
      projection.email.should.equal(false);
      projection['children.name'].should.equal(false);
    });
  });
});