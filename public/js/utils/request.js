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