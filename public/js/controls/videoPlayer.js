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