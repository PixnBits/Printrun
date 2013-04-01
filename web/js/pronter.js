var PRONTER = PRONTER || { revision: 1 };

PRONTER.bodyOnLoad = function(){
	PRONTER.running = PRONTER.running || {};
	
	PRONTER.running.asyncCommander = new PRONTER.asyncCommander();
	PRONTER.running.asyncCommander.setup();
}

PRONTER.asyncCommander = function(){
	// ??? properties?
};

PRONTER.asyncCommander.prototype = {
	setup : function(){
		this.attach();
	},
	attach : function(){
		var list = [];
		if(document.getElementsByClassName){
			list = document.getElementsByClassName('command');
		}else if(document.getElementsByTagName){
			list = document.getElementsByTagName('a');
			list.concat( document.getElementsByTagName('area') );
			//TODO filter list via checking the className attributes
		}else{
			console && console.error && console.error('unable to gather list of elements');
			return false;
		}
		
		var that = this;
		var func = function(e){return that.command(null, e);};
		for(var i=0; i < list.length; i++){
			list[i].addEventListener && list[i].addEventListener( 'click', func, true );
			list[i].attachEvent && list[i].attachEvent( 'onclick', func );
		}
	
		return true;
	},
	command : function( urlOrElement, event ){

		if( ! urlOrElement && event.target)
			urlOrElement = event.target;

		var url = null;
		if( typeof urlOrElement == 'string' ){
			url = urlOrElement;
		}else{
			url = urlOrElement&&urlOrElement.href;
		}

		if( typeof url != 'string' ){
			console && console.error && console.error('url not a string', urlOrElement, url);
			return true;
		}

		var httpRequest;
		if (window.XMLHttpRequest) { // Mozilla, Safari, ...
			httpRequest = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE 8 and older
			httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
	
		if( ! httpRequest ){
			alert('no AJAX available?');
			// follow link
			return true;
		}
	
		//onreadystatechange
		//onerror
		httpRequest.open( 'GET', url, true);
		httpRequest.send(null);
	
		// don't follow link
		if( event ){
			event.stopImmediatePropagation && event.stopImmediatePropagation();
			event.defaultPrevented = true;
			event.preventDefault && event.preventDefault();
		}
		return false;
	}
};


/** command Builder **/
PRONTER.commandBuilder = function(){
};

PRONTER.commandBuilder.prototype = {
	commandlist : {
		// http://reprap.org/wiki/G-code#M106:_Fan_On
		'G' : {
		},
		'M' : {
			0 : {
				'short' : 'Stop',
				'description' : 'The RepRap machine finishes any moves left in its buffer, then shuts down. All motors and heaters are turned off. It can be started again by pressing the reset button on the master microcontroller. See also M1, M112.',
				'example' : 'M0'
			},
			106 : {
				'short' : 'Fan on',
				'description' : 'Turn on the cooling fan',
				'parameters' : {
					'S' : {
						'description' : 'Fan speed',
						'min' : 0,
						'max' : 255,
						'req' : true // required?
					},
					'P' : {
						/*
						Additionally to the above, Teacup Firmware uses M106 to control general devices. It supports the additional P parameter, which is an zero-based index into the list of heaters/devices in config.h.

						Example: M106 P2 S255

						Turn on device #3 at full speed/wattage.
						//*/
					}
				},
				'example' : {
					'M106 S127' : 'Turn on the cooling fan at half speed.'
				},
				'firmware' : {
					'FiveD' : false,
					'Teacup' : true,
					'Sprinter' : true,
					'Marlin' : true,
					'Repetier' : false
				},
				'note' : 'When turning on a temperature sensor equipped heater with M106 and M104 at the same time, temperature control will override the value given in M106 quickly.'
			}
		}
	}
};


/** start up PRONTER when the body is finished loading **/
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", PRONTER.bodyOnLoad, false);
} else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", PRONTER.bodyOnLoad);
} else {
    document.onload = PRONTER.bodyOnLoad;
}
