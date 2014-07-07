var klass = require('klass')
    , _ = require('lodash')
    , obligator = klass({
        initialize: function() {
            this._params = {};
            this._collection = {};
            this._flag = 0;
        }
    })
    .methods({
    	setFlag: function(flag) {
    		this._flag = flag;
    	},
    	getFlag: function() {
    		return this._flag;
    	},
        setCollection: function(collection) {
        	
        	var self = this;
            
            if ( !collection )
                throw Error("[collection] is empty or missing!");
            
            Object.getOwnPropertyNames(this).forEach(function(parameter) {
            	if (typeof self[parameter] !== 'object' && parameter != '_flag') {
            		// Not an object. Set as param.
            		self._params[parameter] = self[parameter];
            	}
            });
             
            this._collection = (typeof collection == 'string') ? JSON.parse(collection) : collection;
        },
        getCollection: function() {
        	return this._collection;
        },
        getParams: function() {
        	return this._params;
        },
        getParam: function(param) {
        	return this._params[param];
        },
        validate: function(fn) {
        	var missingParams = [],
        		callback = (this._flag == 0  ? mixedValidate : strictValidate);
        	Object.keys(this._params).forEach(callback.bind(this));
        	
        	function mixedValidate(param) {
        		if (this.getParam(param) === true && typeof this._collection[param] === 'undefined') {
        			missingParams.push(param);
        		}
        	}
        	function strictValidate(param) {
        		if (this.getParam(param) === true 
        			&& (this._collection[param] === 'undefined'
        			|| this._collection[param] == '')) {
        			missingParams.push(param);
        		}
        	}
        	
        	if (missingParams.length > 0) {
        		if (typeof fn == 'function') {
	        		return fn(missingParams);
	        	}
	        	
	        	throw Error("Missing Parameter(s): " + missingParams);
        	}
        	
            return true;
        },

        reset: function() {
            this._collection = {};
            this._params = {};
        },

        count: function() {
        	return Object.keys(this._params).length;
        },
    });
    
exports.FLAG_MIXED = 0;
exports.FLAG_STRICT = 1;

exports.newFactoryInstance = function() {
    return new obligator;
}
