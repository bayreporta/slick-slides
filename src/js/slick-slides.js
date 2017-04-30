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
	data:{}, 			  	/* imported data */
	
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
        		slickSlides.data['base'] = data;
    		}),
    		$.getJSON( '/dist/json/full.json', function(data) {
        		slickSlides.data['full'] = data;
    		}),
    		$.getJSON( '/dist/json/half.json', function(data) {
        		slickSlides.data['half'] = data;
    		}),
    		$.getJSON( '/dist/json/triplet.json', function(data) {
        		slickSlides.data['triplet'] = data;
    		}),
    		$.getJSON( '/dist/json/quarter.json', function(data) {
        		slickSlides.data['quarter'] = data;
    		}),
    		$.getJSON( '/dist/json/corner.json', function(data) {
        		slickSlides.data['corner'] = data;
    		}),
    		$.getJSON( '/dist/json/circular.json', function(data) {
        		slickSlides.data['circular'] = data;
    		}),
    		$.getJSON( '/dist/json/diagonal.json', function(data) {
        		slickSlides.data['diagonal'] = data;
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
	this.primary_type 			= childData.primary_type;
	this.primary_value 			= childData.primary_value;
	this.primary_effect 		= childData.primary_effect;
	this.primary_effect_value 	= childData.primary_effect_value;
}
slickSlides.inheritSlide( SlickSlideFull, SlickSlide );

// half template slide
function SlickSlideHalf(){
	SlickSlide.call(this, data, childData );
	this.variant						= childData.variant;
	this.half_segment_one_type 			= childData.half_segment_one_type;
	this.half_segment_one_value 		= childData.half_segment_one_value;
	this.half_segment_one_effect_type 	= childData.half_segment_one_effect_type;
	this.half_segment_one_effect_value 	= childData.half_segment_one_effect_value;
	this.half_segment_two_type 			= childData.half_segment_two_type;
	this.half_segment_two_value 		= childData.half_segment_two_value;
	this.half_segment_two_effect_type 	= childData.half_segment_two_effect_type;
	this.half_segment_two_effect_value 	= childData.half_segment_two_effect_value;

}
slickSlides.inheritSlide( SlickSlideHalf, SlickSlide );

// quarter template slide
function SlickSlideQuarter(){
	SlickSlide.call(this, data, childData );
	this.variant							= childData.variant;
	this.quarter_segment_one_type 			= childData.quarter_segment_one_type;
	this.quarter_segment_one_value 			= childData.quarter_segment_one_value;
	this.quarter_segment_one_effect_type 	= childData.quarter_segment_one_effect_type;
	this.quarter_segment_one_effect_value 	= childData.quarter_segment_one_effect_value;
	this.quarter_segment_two_type 			= childData.quarter_segment_two_type;
	this.quarter_segment_two_value 			= childData.quarter_segment_two_value;
	this.quarter_segment_two_effect_type 	= childData.quarter_segment_two_effect_type;
	this.quarter_segment_two_effect_value 	= childData.quarter_segment_two_effect_value;
	this.quarter_segment_three_type 		= childData.quarter_segment_three_type;
	this.quarter_segment_three_value 		= childData.quarter_segment_three_value;
	this.quarter_segment_three_effect_type 	= childData.quarter_segment_three_effect_type;
	this.quarter_segment_three_effect_value = childData.quarter_segment_three_effect_value;
	this.quarter_segment_four_type 			= childData.quarter_segment_four_type;
	this.quarter_segment_four_value 		= childData.quarter_segment_four_value;
	this.quarter_segment_four_effect_type 	= childData.quarter_segment_four_effect_type;
	this.quarter_segment_four_effect_value	= childData.quarter_segment_four_effect_value;
}
slickSlides.inheritSlide( SlickSlideQuarter, SlickSlide );

// corner template slide
function SlickSlideCorner(){
	SlickSlide.call(this, data, childData );	
	this.variant				= childData.variant;
	this.primary_type 			= childData.primary_type;
	this.primary_value 			= childData.primary_value;
	this.primary_effect 		= childData.primary_effect;
	this.primary_effect_value 	= childData.primary_effect_value;
}
slickSlides.inheritSlide( SlickSlideCorner, SlickSlide );

// triplet template slide
function SlickSlideTriplet(){
	SlickSlide.call(this, data, childData );	
	this.variant							= childData.variant;
	this.triplet_segment_one_type 			= childData.triplet_segment_one_type;
	this.triplet_segment_one_value 			= childData.triplet_segment_one_value;
	this.triplet_segment_one_effect_type 	= childData.triplet_segment_one_effect_type;
	this.triplet_segment_one_effect_value 	= childData.triplet_segment_one_effect_value;
	this.triplet_segment_two_type 			= childData.triplet_segment_two_type;
	this.triplet_segment_two_value 			= childData.triplet_segment_two_value;
	this.triplet_segment_two_effect_type 	= childData.triplet_segment_two_effect_type;
	this.triplet_segment_two_effect_value 	= childData.triplet_segment_two_effect_value;
	this.triplet_segment_three_type 		= childData.triplet_segment_three_type;
	this.triplet_segment_three_value 		= childData.triplet_segment_three_value;
	this.triplet_segment_three_effect_type 	= childData.triplet_segment_three_effect_type;
	this.triplet_segment_three_effect_value = childData.triplet_segment_three_effect_value;
}
slickSlides.inheritSlide( SlickSlideTriplet, SlickSlide );

// diagonal template slide
function SlickSlideDiagonal(){
	SlickSlide.call(this, data, childData );	
	this.variant							= childData.variant;
	this.diagonal_segment_one_type 			= childData.diagonal_segment_one_type;
	this.diagonal_segment_one_value 		= childData.diagonal_segment_one_value;
	this.diagonal_segment_one_effect_type 	= childData.diagonal_segment_one_effect_type;
	this.diagonal_segment_one_effect_value 	= childData.diagonal_segment_one_effect_value;
	this.diagonal_segment_two_type 			= childData.diagonal_segment_two_type;
	this.diagonal_segment_two_value 		= childData.diagonal_segment_two_value;
	this.diagonal_segment_two_effect_type 	= childData.diagonal_segment_two_effect_type;
	this.diagonal_segment_two_effect_value 	= childData.diagonal_segment_two_effect_value;
}
slickSlides.inheritSlide( SlickSlideDiagonal, SlickSlide );

// circular template slide
function SlickSlideCircular(){
	SlickSlide.call(this, data, childData );	
	this.primary_type 			= childData.primary_type;
	this.primary_value 			= childData.primary_value;
	this.primary_effect 		= childData.primary_effect;
	this.primary_effect_value 	= childData.primary_effect_value;
	
}
slickSlides.inheritSlide( SlickSlideCircular, SlickSlide );

/* Get the slide party started
==============================================================================================*/
$(document).ready(function(){
	slickSlides.loadJSON();
});



