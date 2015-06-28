var VanillaPlayer = VanillaPlayer || {};

// creates namespaces for modules. Splits by dot
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

// return module if exists. throws error on module not found
VanillaPlayer.module = function(name) {
	if (name) {
		var namespace = VanillaPlayer;
		var parts = name.split(".");
		for (var i in parts) {
			if (!namespace[parts[i]]) {
				throw new Error("module '" + name + "' not found");
			}
			namespace = namespace[parts[i]];
		}
		return namespace;
	}
};