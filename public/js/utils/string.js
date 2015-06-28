;(function(){
	'use strict';

	var module = VanillaPlayer.registerModule("utils");

	// Unless ES6 is not supported yet
	if (!String.prototype.format) {
		String.prototype.format = function (args) {
			return this.replace(/{(\d+)}/g, function (match, number) {
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
	}

})();