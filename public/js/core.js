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