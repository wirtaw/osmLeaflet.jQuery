/**
 * osmLeaflet.jQuery
 * jQuery plugin, wrapper for the Leaflet API
 *
 * @author Mathieu ROBIN
 * @link http://www.mathieurobin.com/osmLeaflet
 * @copyright CreativeCommons BY
 * @version 1.0
 */
(function ($) {
    // Default values
    var defaults = {
	zoom : 10,
	maxZoom : 18,
	latitude : 0,
	longitude : 0,
	cloudmadeAttribution : 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade, osmLeaflet.jQuery by Mathieu ROBIN'
    },
    // Settings based on merged defaults with user settings
    settings,
    // The map element gived by leaflet API
    map,
    // List of available methods
    methods = {
	/**
	 * Initialize the map, it's the default called method if no-one is given
	 *
	 * @param options Array which can contains this options : latitude, longitude, zoom, markers, popup, cloudmadeAttribution, click event
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

		if("undefined" !== typeof options.click) {
		    if("function" === typeof options.click) {
			map.on('click', options.click);
		    }
		}

		if("undefined" !== typeof options.markers) {
		    that.osmLeaflet('addMarker', options.markers);
		}

		if("undefined" !== typeof options.popup) {
		    that.osmLeaflet('addPopup', options.popup);
		}
	    });
	},
	/**
	 * Put one or more markers on the map
	 *
	 * @param options Array or Object which can contains this options : latitude, longitude
	 * @return jQuery Object containing the DOM element extended
	 */
	addMarker : function (options) {
	    var that = this;
	    return this.each(function () {
		if("undefined" !== typeof options) {
		    if("undefined" === typeof options.length) {
			var markerLocation = new L.LatLng(options.latitude, options.longitude);
			var marker = new L.Marker(markerLocation);
			if("undefined" !== typeof options.click) {
			    marker.bindPopup(options.click.content, options.click);
			}
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
	/**
	 * Put a popup on the map
	 *
	 * @param options Object which can contains this options : latitude, longitude, content, autoPan
	 * @return jQuery Object containing the DOM element extended
	 */
	addPopup : function (options) {
	    return this.each(function () {
		if("undefined" !== typeof options) {
		    var popup = new L.Popup();

		    popup.setLatLng(new L.LatLng(options.latitude, options.longitude));
		    popup.setContent(options.content);

		    map.openPopup(popup);
		}
	    });
	},
	/**
	 * Define handler for the click event
	 *
	 * @param callback function Event could be retrieved by the parameter
	 * @return jQuery Object containing the DOM element extended
	 * TODO: could take a Deferred object too
	 */
	onClick : function (callback) {
	    return this.each(function () {
		if("undefined" !== typeof callback) {
		    if("function" === typeof callback) {
			map.on('click', callback);
		    }
		    else if("Deferred" === typeof callback) {
			map.on('click', function () {callback.resolve()});
		    }
		}
	    });
	}
    };

    /**
     * Bootstrap method, must be not modified
     */
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