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