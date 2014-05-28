'use strict';

/*jshint node:true */
/*global describe, it, afterEach, beforeEach*/

require('should');
var select = require('../lib/index.js');

function getNonChainProperties(object){
  function isNotChainMethod(name){
      // remove initial _
      var chainMethods = Object.keys(select).concat(['always']);
      
      var result = chainMethods.indexOf(name.substring(1)) === -1 || (typeof object[name] !== 'function');
      
      return result;
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
  
  describe('exclude then exclude', function(){
    var projection;
    beforeEach(function() {
      projection = select.exclude(['email'])._exclude(['name']);
    });
    it('should only have excluded values', function(){
      getNonChainProperties(projection).length.should.equal(2);
    });
    it('should set all values to false', function(){
      projection.email.should.equal(false);
      projection.name.should.equal(false);
    });
  });
  
  describe('include then include', function(){
    var projection;
    beforeEach(function() {
      projection = select.include(['email'])._include(['name']);
    });
    it('should only have included values', function(){
      getNonChainProperties(projection).length.should.equal(2);
    });
    it('should set all values to false', function(){
      projection.email.should.equal(true);
      projection.name.should.equal(true);
    });
  });
});

describe('always', function(){
  describe('excluding', function() {
    beforeEach(function() {
      select.exclude(['name', 'email'])._always();
    });
    
    afterEach(function(){
      select.clear();
    });
    
    it('should add excluded fields to future exclusions', function(){
      var projection = select.exclude(['children.name'])._noId();
      projection._id.should.equal(false);
      projection.name.should.equal(false);
      projection.email.should.equal(false);
      projection['children.name'].should.equal(false);
    });
    
    it('should remove excluded fields from future inclusions', function(){
      var projection = select.include(['children.name', 'name', 'email']);
      (typeof projection.name === 'undefined').should.equal(true);
      (typeof projection.email === 'undefined').should.equal(true);
      projection['children.name'].should.equal(true);
    });
    
    it('should not add excluded fields to be excluded in future inclusions', function(){
      var projection = select.include(['children.name']);
      (typeof projection.name === 'undefined').should.equal(true);
      (typeof projection.email === 'undefined').should.equal(true);
      projection['children.name'].should.equal(true);
    });
  });
  describe('including', function() {
    beforeEach(function() {
      select.include(['name', 'email'])._always();
    });
    
    afterEach(function(){
      select.clear();
    });
    
    it('should add included fields to future inclusions', function(){
      var projection = select.include(['children.name'])._noId();
      projection._id.should.equal(false);
      projection.name.should.equal(true);
      projection.email.should.equal(true);
      projection['children.name'].should.equal(true);
    });
    
    it('should remove included fields from future exclusions', function(){
      var projection = select.exclude(['children.name', 'name', 'email']);
      (typeof projection.name === 'undefined').should.equal(true);
      (typeof projection.email === 'undefined').should.equal(true);
      projection['children.name'].should.equal(false);
    });
    
    it('should not add included fields to be included in future exclusions', function(){
      var projection = select.exclude(['children.name']);
      (typeof projection.name === 'undefined').should.equal(true);
      (typeof projection.email === 'undefined').should.equal(true);
      projection['children.name'].should.equal(false);
    });
  });
});