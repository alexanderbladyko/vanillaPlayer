;(function(){
	'use strict';

	var module = VanillaPlayer.registerModule("utils");

	// Unless ES6 is not supported yet
	var Promise = function() {
		this._success = [];
		this._failure = [];
		this._data = null;
		this._rejected = false;
	};

	Promise.prototype = {
		success: function(callback) {
			if (typeof callback !== 'function')
				return this;
			// if object is already resolved
			if (this._data) {
				callback(this._data);
			} else {
				this._success.push(callback);
			}
			return this;
		},

		failure: function(callback) {
			if (typeof callback !== 'function')
				return this;
			// if object is already rejected
			if (this._rejected) {
				callback(this._data);
			} else {
				this._failure.push(callback);
			}
			return this;
		}
	};

	module.Deferred = function() {
		this._promise = new Promise();
	};

	module.Deferred.prototype = Object.create(Object.prototype);

	module.Deferred.prototype.promise = function() {
		return this._promise;
	};

	module.Deferred.prototype.resolve = function(data)  {
		this._promise._data = data;
		for (var i in this._promise._success) {
			this._promise._success[i].call(this, data);
		}
		// the fastest way to clean array
		this._promise._success.length = 0;
		this._promise._failure.length = 0;
	};

	module.Deferred.prototype.reject = function(reason)  {
		this._promise._rejected = true;
		this._promise._data = reason;
		for (var i in this._promise._failure) {
			this._promise._failure[i].call(this, reason);
		}
		// the fastest way to clean array
		this._promise._success.length = 0;
		this._promise._failure.length = 0;
	};

})();