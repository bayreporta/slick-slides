// testing what would be incoming from json //
var baseSlide = {
	'id': 					null,
	'pretty_id': 			null,
	'base_template': 		null,
	'header': 				null,
	'header_content': 		null,
	'background_type': 		null,
	'background_value': 	null,
	'transition_speed': 	null,
	'slide_left': 			null,
	'slide_right': 			null,
	'slide_up': 			null,
	'slide_down': 			null,
	'toggle_options': 		null,
	'total_options': 		null,
	'options_location': 	null	
};

var childSlide = {
	'primary_type': 		null,
	'primary_value': 		null,
	'primary_effect': 		null,
	'primary_effect_value': null
};

/* Stores all utility functions and global variables for Slick Slides
==============================================================================================*/

var slickSlides = {
	slides: 		[],	  	/* will eventually store all the slides */
	totalSlides: 	null, 	/* total slides */
	targetElement: 	null, 	/* target element to append slides to */
	data:{				  	/* imported data */
		base: 		[] 	  	/* base slide data */
	},	
	
	inheritSlide:function( child, parent ){
		//copy props and methods of base slide object
		var copyOfParent = Object.create(parent.prototype);
		//set constuctor to subclass object
		copyOfParent.constructor = child;
		//make it so parent class can now inherit subclass props and methods
		child.prototype = copyOfParent;
	},

	loadJSON:function(){
		$.when(
			// load base slide data
			$.getJSON( '/dist/json/slides.json', function(data) {
        		slickSlides.data.base = data;
    		})
		).then(function(){
			// load next set of functions //
		});
	}
};



/* Parent object for all slide objects - all slides will inherit from this constructor
==============================================================================================*/
function SlickSlide( data ) {
	//init instance properties
	this.id = 			data.id;
	this.prettyid = 	data.pretty_id;
	this.type = 		data.base_template;
	this.speed = 		data.transition_speed;
	this.directions = {
		left: 			data.slide_left,
		right: 			data.slide_right,
		up: 			data.slide_up,
		down: 			data.slide_down
	};
	this.background = {
		type: 			data.background_type,
		value: 			data.background_value
	};
	//check if there are options
	if ( typeof( data.toggle_options ) !== null ){
		this.options = {
			total: 		data.total_options,
			location: 	data.options_location
		};
	}
	//check if there is a header
	if ( typeof( data.header ) !== null ){ 
		this.header = 	data.header_content; 
	}
}

/* Child objects based on slide templates
==============================================================================================*/

// full template slide
function SlickSlideFull( data, childData ){
	SlickSlide.call(this, data, childData );
	this.primarytype = 	childData.primary_type;
	this.primarytype = 	childData.primary_value;
	this.primarytype = 	childData.primary_effect;
	this.primarytype = 	childData.primary_effect_value;
}
slickSlides.inheritSlide( SlickSlideFull, SlickSlide );
	
// half template slide
function SlickSlideHalf(){
	SlickSlide.call(this, data );

}
slickSlides.inheritSlide( SlickSlideHalf, SlickSlide );

// quarter template slide
function SlickSlideQuarter(){
	SlickSlide.call(this, data );

}
slickSlides.inheritSlide( SlickSlideQuarter, SlickSlide );

// corner template slide
function SlickSlideCorner(){
	SlickSlide.call(this, data );
	
}
slickSlides.inheritSlide( SlickSlideCorner, SlickSlide );

// triplet template slide
function SlickSlideTriplet(){
	SlickSlide.call(this, data );

}
slickSlides.inheritSlide( SlickSlideTriplet, SlickSlide );

// diagonal template slide
function SlickSlideDiagonal(){
	SlickSlide.call(this, data );

}
slickSlides.inheritSlide( SlickSlideDiagonal, SlickSlide );

// circular template slide
function SlickSlideCircular(){
	SlickSlide.call(this, data );
	
}
slickSlides.inheritSlide( SlickSlideCircular, SlickSlide );

/* Get the slide party started
==============================================================================================*/
$(document).ready(function(){
	slickSlides.loadJSON();
});



