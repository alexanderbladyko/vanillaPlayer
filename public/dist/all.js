var VanillaPlayer = VanillaPlayer || {};

VanillaPlayer.registerModule = function(name) {
	if (name) {
		var namespace = VanillaPlayer;
		var parts = name.split(".");
		for (var i in parts) {
			if (!namespace[parts[i]]) {
				namespace[parts[i]] = {};
			}
			namespace = namespace[parts[i]];
		}
		return namespace;
	}
};

VanillaPlayer.module = function(name) {
	if (name) {
		var namespace = VanillaPlayer;
		var parts = name.split(".");
		for (var i in parts) {
			if (!namespace[parts[i]]) {
				throw new Error("module not found");
			}
			namespace = namespace[parts[i]];
		}
		return namespace;
	}
};
;(function(){
	'use strict';

	var module = VanillaPlayer.registerModule("controls.video");

	module.VideoPlayerProto = Object.create(HTMLVideoElement.prototype);

	module.VideoPlayerProto.changeSource = function(source) {
		alert(5);
	};

	module.VideoPlayer = document.registerElement('video-player', {
		prototype: module.VideoPlayerProto,
		extends: 'video'
	});


})();
;(function(){
	'use strict';

	var module = VanillaPlayer.registerModule("controllers");


})();
;(function(){
	'use strict';

	var module = VanillaPlayer.registerModule("controllers.movies");

	var v = VanillaPlayer.module("controls.video");

	module.VideoCtrl = function(){

		var videoContainer = document.getElementById("player-container");

		var video = new v.VideoPlayer();
		videoContainer.appendChild(video);
		
	};
})();
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

	module.Deferred.promise = function() {
		return this._promise;
	};

	module.Deferred.resolve = function(data)  {
		this._promise._data = data;
		for (var i in this._promise._success) {
			this._promise._success[i].call(this, data);
		}
		this._promise._success.length = 0;
		this._promise._failure.length = 0;
	};

	module.Deferred.reject = function(reason)  {
		this._promise._rejected = true;
		this._promise._data = reason;
		for (var i in this._promise._failure) {
			this._promise._failure[i].call(this, reason);
		}
		this._promise._success.length = 0;
		this._promise._failure.length = 0;
	};

})();
;(function(){
	'use strict';

	var module = VanillaPlayer.registerModule("utils");

	module.request = function(uri) {
		var core = {

			ajax : function (method, ajaxUri, args) {

				var deferred = new module.Deferred();

				var client = new XMLHttpRequest();

				if (args && (method === 'POST' || method === 'PUT')) {
					ajaxUri += '?';
					var argcount = 0;
					for (var key in args) {
						if (args.hasOwnProperty(key)) {
							if (argcount++) {
								ajaxUri += '&';
							}
							ajaxUri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
						}
					}
				}

				client.onload = function () {
					if (this.status == 200) {
						deferred.resolve(this.response);
					} else {
						deferred.reject(this.statusText);
					}
				};
				client.onerror = function () {
					deferred.reject(this.statusText);
				};

				client.open(method, ajaxUri);
				client.send();

				return deferred.promise();
			}
		};

		return {
			get : function(args) {
				return core.ajax('GET', uri, args);
			},
			post : function(args) {
				return core.ajax('POST', uri, args);
			},
			put : function(args) {
				return core.ajax('PUT', uri, args);
			},
			delete : function(args) {
				return core.ajax('DELETE', uri, args);
			}
		};
	};


})();