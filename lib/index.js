'use strict';

/*jshint node:true */

function setFields(fields, value, existing)
{
	var projection = existing || {};
	fields.forEach(function(field){
		projection[field] = value;
	});
	
	return projection;
}

function include(fields, existing){
	return setFields(fields, true, existing);
}

function exclude(fields, existing){
	return setFields(fields, false, existing);
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