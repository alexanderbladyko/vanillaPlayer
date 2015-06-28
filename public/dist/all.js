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
;(function () {
	'use strict';

	var module = VanillaPlayer.registerModule("controls");

	module.ListProto = Object.create(HTMLElement.prototype);

	module.ListProto.setItems = function (items, factory) {
		var content = document.createDocumentFragment();

		if (this.captionForm) {
			var caption = document.createElement('label');
			caption.innerHTML = this.captionForm[items.length] || this.captionForm.other;
			content.appendChild(caption);
		}

		for (var i in items) {
			var element = factory(items[i]);
			element.model = items[i];
			element.addEventListener('click', this._onElementClicked.bind(this));
			content.appendChild(element);
		}

		this.innerHTML = "";
		this.appendChild(content);
	};

	module.ListProto.setCaptionForm = function(form) {
		this.captionForm = form;
	};

	module.ListProto._onElementClicked = function(event) {
		var selectedEvent = new CustomEvent('element-selected', {
			detail: {
				model: event.currentTarget.model
			},
			bubbles: true,
			cancelable: false
		});
		if (this._selectedItem !== event.currentTarget) {
			event.currentTarget.classList.add("selected");
			if (this._selectedItem)
				this._selectedItem.classList.remove("selected");
		}
		this._selectedItem = event.currentTarget;

		event.currentTarget.dispatchEvent(selectedEvent);
	};

	module.List = document.registerElement('item-list', {
		prototype: module.ListProto,
		_selectedItem: undefined,
		_items: []
	});


})();
;(function(){
	'use strict';

	var module = VanillaPlayer.registerModule("controls.video");

	module.VideoPlayerProto = Object.create(HTMLVideoElement.prototype);

	module.VideoPlayerProto.setSource = function(source) {
		this.setAttribute("controls", "");
		this.setAttribute("poster", source.images.placeholder);

		var content = document.createDocumentFragment();
		for (var i in source.streams) {
			var stream = source.streams[i];
			var sourceElement = document.createElement("source");
			sourceElement.setAttribute("src", stream.url);
			sourceElement.setAttribute("type", "video/" + stream.type);
			content.appendChild(sourceElement);
		}

		this.innerHTML = "";
		this.appendChild(content);

		if (!this.paused)
			this.pause();

		var that = this;
		setTimeout(function() {
			that.load();
			that.play();
		}, 0);
	};

	module.VideoPlayerProto.attachedCallback = function() {
		// starts and stops video on mouse click
		this.addEventListener("click", this.toggleVideo);
	};

	module.VideoPlayerProto.toggleVideo = function() {
		if (this.paused || this.ended) {
			this.play();
		} else {
			this.pause();
		}
	};

	module.VideoPlayer = document.registerElement('video-player', {
		prototype: module.VideoPlayerProto,
		extends: 'video'
	});

})();
;(function(){
	'use strict';

	var module = VanillaPlayer.registerModule("controllers.movies");

	var controls, http;

	module.VideoCtrl = function(){

		controls = VanillaPlayer.module("controls");
		http = VanillaPlayer.module("utils").request;

		// initializing controls
		var video = _createVideo("player");

		var videoTitle = _createLabel("video-title", "{0} ( {1} )");

		var directors = _createList("directors", { '1': 'Director:', 'other': 'Directors:' });
		var actors = _createList("actors", { '1': 'Actor:', 'other': 'Actors:' });

		var videos = _createList("videos");
		videos.addEventListener('element-selected', function(event) {
			video.setSource(event.detail.model);
			videoTitle.setText(event.detail.model.title, event.detail.model.meta.releaseYear);
			directors.setItems(event.detail.model.meta.directors, _createListItem);
			actors.setItems(event.detail.model.meta.actors, _createListItem);
		});

		// getting items
		var movies = http("/movies").get();
		movies.success(function(data) {

			videos.setItems(JSON.parse(data), _createVideoListItem);

		}).failure(function() {
			alert("Failed to get data from server");
		});
		
	};

	function _createVideo(containerId) {
		var videoContainer = document.getElementById(containerId);
		var video = new controls.video.VideoPlayer();
		videoContainer.appendChild(video);
		return video;
	}

	function _createVideoListItem(item) {
		var listItem = document.createElement("div");
		listItem.classList.add("columns-4");

		var videoWrapper = document.createElement("div");
		videoWrapper.classList.add("video-item");

		var thumbnail = document.createElement("img");
		thumbnail.src = item.images.cover;

		var description = document.createElement("p");

		var title = document.createElement("cite");
		title.innerHTML = item.title;
		description.appendChild(title);

		description.appendChild(document.createElement("br"));

		var year = document.createElement("i");
		year.innerHTML = item.meta.releaseYear;
		description.appendChild(year);

		videoWrapper.appendChild(thumbnail);
		videoWrapper.appendChild(description);

		listItem.appendChild(videoWrapper);
		return listItem;
	}

	function _createList(containerId, captionForm) {
		var container = document.getElementById(containerId);
		var list = new controls.List();
		list.setCaptionForm(captionForm);
		container.appendChild(list);
		return list;
	}

	function _createListItem(item) {
		var address = document.createElement("address");
		address.textContent = item.name;
		return address;
	}

	function _createLabel(containerId, format) {
		var container = document.getElementById(containerId);
		var label = new controls.FormatLabel();
		label.setFormat(format);
		container.appendChild(label);
		return label;
	}
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
					var count = 0;
					for (var key in args) {
						if (args.hasOwnProperty(key)) {
							if (count++) {
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