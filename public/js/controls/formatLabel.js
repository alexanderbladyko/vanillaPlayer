;(function () {
	'use strict';

	var module = VanillaPlayer.registerModule("controls");

	module.FormatLabelProto = Object.create(HTMLLabelElement.prototype);

	module.FormatLabelProto.setFormat = function (format) {
		this._format = format;
	};

	module.FormatLabelProto.setText = function() {
		this.textContent = this._format.format(arguments);
	};

	module.FormatLabel = document.registerElement('format-label', {
		prototype: module.FormatLabelProto
	});
})();