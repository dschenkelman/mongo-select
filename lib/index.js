'use strict';

/*jshint node:true */

function setFields(fields, value, existing)
{
	var projection = existing || {};
	fields.forEach(function(field){
		projection[field] = value;
	});
	
	projection._noId = function() { return noId(this); };
	
	return projection;
}

function include(fields, existing){
	return setFields(fields, true, existing);
}

function exclude(fields, existing){
	return setFields(fields, false, existing);
}

function noId(existing){
	existing = existing || {};
	existing._id = false;
	existing._exclude = function(fields) { return exclude(fields, this); };
	existing._include = function(fields) { return include(fields, this); };
	
	return existing;
}

exports.exclude = exclude;
exports.include = include;
exports.noId = noId;