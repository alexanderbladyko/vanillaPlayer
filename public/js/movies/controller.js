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