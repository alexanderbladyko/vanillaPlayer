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