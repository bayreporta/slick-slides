/* Utility functions
==============================================================================================*/

// object inheritence code
function inheritSlide( child, parent ) {
  	var copyOfParent = Object.create(parent.prototype);

	copyOfParent.constructor = child;

	child.prototype = copyOfParent;
}

/* Parent object for all slide objects - all slides will inherit from this constructor
==============================================================================================*/
function SlickSlide( id, prettyid, type, variant, dLeft, dRight, dUp, dDown, speed, options, optTot, optLoc, background, backgroundVal, header, headerVal ) {
	//init instance properties
	this.id = id;
	this.prettyid = prettyid;
	this.type = type;
	this.variant = variant;
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

/* Child objects based on slide templates
==============================================================================================*/

// full template slide
function SlickSlideFull( test ){
	SlickSlide.call(this);
}
inheritSlide( SlickSlideFull, SlickSlide );

// half template slide
function SlickSlideHalf(){
	SlickSlide.call(this);

}
inheritSlide( SlickSlideHalf, SlickSlide );

// quarter template slide
function SlickSlideQuarter(){
	SlickSlide.call(this);

}
inheritSlide( SlickSlideQuarter, SlickSlide );

// corner template slide
function SlickSlideCorner(){
	SlickSlide.call(this);
	
}
inheritSlide( SlickSlideCorner, SlickSlide );

// triplet template slide
function SlickSlideTriplet(){
	SlickSlide.call(this);

}
inheritSlide( SlickSlideTriplet, SlickSlide );

// diagonal template slide
function SlickSlideDiagonal(){
	SlickSlide.call(this);

}
inheritSlide( SlickSlideDiagonal, SlickSlide );

// circular template slide
function SlickSlideCircular(){
	SlickSlide.call(this);
	
}
inheritSlide( SlickSlideCircular, SlickSlide );


//testing
var slide = [];
slide[0] = new SlickSlide( 23, 'prettyid', 'full', null, 22, 24, null, null, 1, false, null, null, 'color', '#000', true, 'Hello World' );




/*SlickSlide.prototype.getProperty = function(){
	return this.property;
}*/



