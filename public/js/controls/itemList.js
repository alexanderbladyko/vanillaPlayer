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