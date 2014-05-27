'use strict';

/*jshint node:true */

function include(fields, existing){
	var projection = existing || {};
	fields.forEach(function(field){
		projection[field] = true;
	});
	
	return projection;
}

function exclude(fields, existing){
	var projection = existing || {};
	fields.forEach(function(field){
		projection[field] = false;
	});
	
	return projection;
}

exports.exclude = exclude;
exports.include = include;

exports.noId = function(fields){
	return {
		_id: false, 
		_exclude: function(fields) { return exclude(fields, this); },
		_include: function(fields) { return include(fields, this); } 
	};
};