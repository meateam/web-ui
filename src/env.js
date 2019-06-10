(function (window) {
  window.__env = window.__env || {};
	var xhr = new XMLHttpRequest();
	xhr.onload = function(event) {
		window.__env = JSON.parse(event.target.response);
	};

  xhr.open("GET", "/api/config");
	xhr.send();
}(this));