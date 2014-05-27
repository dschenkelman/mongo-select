'use strict';

/*jshint node:true */

exports.include = function(fields){
	var projection = {};
	fields.forEach(function(field){
		projection[field] = true;
	});
	
	return projection;
};

exports.exclude = function(fields){
	var projection = {};
	fields.forEach(function(field){
		projection[field] = false;
	});
	
	return projection;
};

exports.noId = function(fields){
	return { _id: false };
};