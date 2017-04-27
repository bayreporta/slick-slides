/* Parent object for all slide objects - all slides will inherit from this constructor
==============================================================================================*/
function SlickSlide( id, prettyid, type, dLeft, dRight, dUp, dDown, speed, options, optTot, optLoc, background, backgroundVal, header, headerVal ) {
	//init instance properties
	this.id = id;
	this.prettyid = prettyid;
	this.type = type;
	this.directions = {
		left: 	dLeft,
		right: 	dRight,
		up: 	dUp,
		down: 	dDown
	};
	this.speed = speed;
	this.background = {
		type: 	background,
		value: 	backgroundVal
	};

	//check if there are options
	if ( typeof( options ) !== null ){
		this.options = {
			total: 		optTot,
			location: 	optLoc
		};
	}

	//check if there is a header
	if ( typeof( header ) !== null ){ 
		this.header = headerVal; 
	}

}

var slide = [];
	slide[0] = new SlickSlide( 23, 'prettyid', 'full', 22, 24, null, null, 1, false, null, null, 'color', '#000', true, 'Hello World' );

SlickSlide.prototype.getProperty = function(){
	return this.property;
}



