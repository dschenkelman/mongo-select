'use strict';

/*jshint node:true */

function select(){
	var must = {};
	
	function always(projection){
		getNonChainProperties(projection).forEach(function(name){
			must[name] = projection[name];
		});
	}
	
	function setFields(fields, value, existing)
	{
		var projection = existing || {};
		fields.forEach(function(field){
			projection[field] = value;
		});
		
		projection._noId = function() { return noId(this); };
		projection._always = function() { return always(this); };
		
		if (value) {
			projection._include = function(fields) { return include(fields, this); };
		} else {
			projection._exclude = function(fields) { return exclude(fields, this); };
		}
		
		Object.keys(must).forEach(function(name){
			if (must[name]){
				if (projection[name] === false){
					delete projection[name];
				} else if (value) {
					projection[name] = true;
				}
			} else {
				if (!projection[name] && !value) {
					projection[name] = false; 
				} else {
					delete projection[name];
				}
			}
		});
		
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
	
	return {
		exclude: exclude,
		include: include,
		noId: noId,
		clear: function () { must = {}; }
	};
}

function getNonChainProperties(object){
	function isNotChainMethod(name){
			// remove initial _
			return ['exclude', 'include', 'always', 'noId'].indexOf(name.substring(1)) === -1 || (typeof object[name] !== 'function');
	}
	
	return Object.keys(object).filter(isNotChainMethod);
}

exports.select = select;