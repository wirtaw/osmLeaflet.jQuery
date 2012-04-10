(function ($) {
    var defaults = {
	zoom : 10,
	maxZoom : 18,
	latitude : 0,
	longitude : 0,
	cloudmadeAttribution : 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade, osmLeaflet.jQuery by Mathieu ROBIN'
    },
    settings,
    map,
    methods = {
	/**
	 * Initialize the map, it's the default called method if no-one is given
	 *
	 * @param options Array which can contains this options : latitude, longitude, zoom, cloudmadeAttribution
	 * @return jQuery Object containing the DOM element extended
	 */
	init : function (options) {
	    var that = this;
	    return this.each(function () {
		if(options) {
		    settings = $.extend(defaults, options);
		}
		map = new L.Map(this.id);

		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
		cloudmade = new L.TileLayer(cloudmadeUrl, {
		    maxZoom: settings.maxZoom,
		    attribution: settings.cloudmadeAttribution
		});

		map.setView(new L.LatLng(settings.latitude, settings.longitude), settings.zoom).addLayer(cloudmade);

		if("undefined" !== typeof options.markers) {
		    that.osmLeaflet('addMarker', options.markers);
		}

		if("undefined" !== typeof options.popup) {
		    that.osmLeaflet('addPopup', options.popup);
		}
	    });
	},
	addMarker : function (options) {
	    var that = this;
	    return this.each(function () {
		if("undefined" !== typeof options) {
		    if("undefined" === typeof options.length) {
			var markerLocation = new L.LatLng(options.latitude, options.longitude);
			var marker = new L.Marker(markerLocation);
			map.addLayer(marker);
		    }
		    else {
			for(marker in options) {
			    that.osmLeaflet('addMarker', options[marker]);
			}
		    }
		}
	    });
	},
	addPopup : function (options) {
	    return this.each(function () {
		if("undefined" !== typeof options) {
		    var popup = new L.Popup();

		    popup.setLatLng(new L.LatLng(options.latitude, options.longitude));
		    popup.setContent(options.content);

		    map.openPopup(popup);
		}
	    });
	}
    };

    $.fn.osmLeaflet = function (method) {
	if(methods[method]) {
	    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else if(( typeof method === 'object') || (!method)) {
	    return methods.init.apply(this, arguments);
	} else {
	    $.error('Method ' + method + ' does not exist on jQuery.osmLeaflet');
	}
    };
})(jQuery);