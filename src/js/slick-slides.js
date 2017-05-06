/* Stores all utility functions and global variables for Slick Slides
==============================================================================================*/

var slickSlides = {
	target_element: null, 	/* target element to append slides to */
	total_slides: 	null, 	/* total slides */	
	slides: 		[],	  	/* will eventually store all the slides */
	total_JSON: 	11, 	/* total json files to load if not Wordpress */
	JSON_files: 	[		/* array of all json that need to be loaded if not Wordress */
		{
			name: 'title',
			object: $.Deferred()
		},
		{
			name: 'full',
			object: $.Deferred()
		},
		{
			name: 'half',
			object: $.Deferred()
		},
		{
			name: 'triplet',
			object: $.Deferred()
		},
		{
			name: 'quarter',
			object: $.Deferred()
		},
		{
			name: 'corner',
			object: $.Deferred()
		},
		{
			name: 'diagonal',
			object: $.Deferred()
		},
		{
			name: 'circular',
			object: $.Deferred()
		},
		{
			name: 'master',
			object: $.Deferred()
		},
		{
			name: 'fonts',
			object: $.Deferred()
		},
		{
			name: 'slides',
			object: $.Deferred()
		},
	],
	total_fonts: 	null,	/* total custom fonts */
	data: 			{}, 	/* imported temporary data */
	
	//passes parent slide class parameters down to all subclasses
	inheritSlide:function( child, parent ){
		var copyOfParent = Object.create(parent.prototype);
		copyOfParent.constructor = child;
		child.prototype = copyOfParent;
	},
	//configure this build of SlickSlides 
	configureBuild:function( d ){
		var options = d.length;
		for ( var i = 0 ; i < options ; i++ ){
			this[d[i].variable] = d[i].value;
		}	

		//add slickslides class to target element
		$( '#' + this.target_element ).addClass( 'slickslides' );
	},
	//if special fonts are requested, set up for loading
	configureFonts:function( d ){
		var fontScript 		= '<script type="text/javascript">WebFont.load({',
			googleFontsBase = 'google:{families:[',
			googleFonts 	= ''; 

		//process font data
		for ( var i = 0 ; i < this.total_fonts ; i++ ){			
			//configure WebFontLoader based on type of font
			switch( d[i].font_service ){
				case 'google':
					if ( googleFonts === '' ){
						googleFonts = '\'' + d[i].font_family + '\'';
					}
					else {
						googleFonts += ',\''	 + d[i].font_family + '\'';
					}
					break;
				case 'typekit':
					//dont forget extra step with id
					break;
			}

			//add fonts to elements
			var fam = '\'' + d[i].font_family + '\'';
			switch( d[i].target ){
				case 'header':
					$( '.slickslides h1' ).add( '.slickslides h2' ).add( '.slickslides h3' ).add( '.slickslides h4' ).css( 'font-family', fam );
					break;
				case 'body':
					$( '.slickslides p' ).add( '.slickslides span' ).css( 'font-family', fam );
					break;
			}
		}

		//add fonts
		googleFontsBase += googleFonts + ']},'; 
		fontScript += googleFontsBase;

		//close up the script and append
		fontScript += 'classes:false});</script>';
		$( 'body' ).append( fontScript );

	},
	//build slide objects based on input
	createSlides:function( d ){
		for ( var i = 0 ; i < this.total_slides ; i++ ) {
			var childID = slickSlides.locateChildData( d.slides[i].id, d.slides[i].base_template ),
				slide;
			//create subclass based on slide template
			switch( d.slides[i].base_template ){
				case 'title':
					slide = new SlickSlideTitle( d.slides[i], d.title[childID] );
					slickSlides.slides.push( slide );
					break;
				case 'full':
					slide = new SlickSlideFull( d.slides[i], d.full[childID] );
					slickSlides.slides.push( slide );
					break;
				case 'half':
					slide = new SlickSlideHalf( d.slides[i], d.half[childID] );
					slickSlides.slides.push( slide );
					break;
				case 'triplet':
					slide = new SlickSlideTriplet( d.slides[i], d.triplet[childID] );
					slickSlides.slides.push( slide );
					break;
				case 'quarter':
					slide = new SlickSlideQuarter( d.slides[i], d.quarter[childID] );
					slickSlides.slides.push( slide );
					break;
				case 'corner':
					slide = new SlickSlideCorner( d.slides[i], d.corner[childID] );
					slickSlides.slides.push( slide );
					break;
				case 'diagonal':
					slide = new SlickSlideDiagonal( d.slides[i], d.diagonal[childID] );
					slickSlides.slides.push( slide );
					break;
				case 'circular':
					slide = new SlickSlideCircular( d.slides[i], d.circular[childID] );
					slickSlides.slides.push( slide );
					break;
			}

			//build the slide and append to DOM
			slickSlides.slides[i].buildSlide();
		}
		
	},	
	//locate a slides child data when building
	locateChildData:function( slideID, template ){
		var data 	= this.data[template],
			length 	= data.length;
		for ( var i = 0 ; i < length ; i++ ){
			if ( slideID === data[i].id ){
				return i;
			}
		}
	},
	//load json files if source of data
	loadJSON:function( t ){
		//try to load each json file
		for ( var i = 0 ; i < this.total_JSON ; i++ ){
			(function (i){
				var name 	= t[i].name,
					pos 	= i;
				$.ajax({
					url: '/dist/json/' + name + '.json',
					dataType: 'json',
					success:function(data){
		    			slickSlides.data[name] = data;
					},
					complete:function(data){
						slickSlides.JSON_files[pos].object.resolve();
					}
				});
			})(i);
		}

		//when all the json are finished loading, executing build scripts
		$.when(
			t[slickSlides.total_JSON - 1].object
		).then(function(){
			//process variables for the entire slide show
			slickSlides.configureBuild( slickSlides.data.master );	

			//create slide objects and DOM elements
			slickSlides.createSlides( slickSlides.data );

			//if there are special fonts, process them here
			if ( slickSlides.total_fonts > 0 ) { slickSlides.configureFonts( slickSlides.data.fonts ); }
		});
	}
};

/* Parent object for all slide objects - all slides will inherit from this constructor
==============================================================================================*/
function SlickSlide( data ) {
	//init instance properties
	this.id = 			data.id;
	this.pretty_id = 	data.pretty_id;
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

//build the slide
SlickSlide.prototype.buildSlide = function(){
	var targetElem 	= document.getElementById( slickSlides.target_element ),
		slide 		= '<section class="slickslide" data-slide-id="' + this.id + '" ';

	//add transition data 
	if ( this.slide_left ) 	{ slide += 'data-slide-left="' + this.slide_left + '" '; }
	if ( this.slide_right ) { slide += 'data-slide-right="' + this.slide_right + '" '; }
	if ( this.slide_up ) 	{ slide += 'data-slide-up="' + this.slide_up + '" '; }
	if ( this.slide_down ) 	{ slide += 'data-slide-down="' + this.slide_down + '" '; }
	
	//finish closing initial section element
	slide += '>';

	//add header if active
	if ( this.header ){ slide += '<div class="slickslide-header"><h1>' + this.header + '</h1></div>'; }

	//add appropriate template elements
	slide += this.buildChildElements( this );

	//close slide element
	slide += '</section>';

	//append to DOM
    targetElem.innerHTML += slide ;
};

//will add elements to the slide
SlickSlide.prototype.buildSlideElement = function( type, content ){
	var slide = '<div class="slickslide-' + type + '">';
	
	//add elements based on type
	switch( type ){
		case 'text':
		case 'quote':
			slide += '<p>' + content + '</p>';
			break;
	}

	//close element
	slide += '</div>';

	return slide;
};

/* Child objects based on slide templates
==============================================================================================*/

// title template slide
function SlickSlideTitle( parentData, childData ){
	SlickSlide.call(this, parentData, childData );
	this.id   					= childData.id;
	this.pretty_id   			= childData.pretty_id;
	this.header_text 			= childData.header_text;
	this.subhead_text 			= childData.subhead_text;
	this.credit_text 			= childData.credit_text;
	this.primary_effect 		= childData.primary_effect;
	this.primary_effect_value 	= childData.primary_effect_value;
}
slickSlides.inheritSlide( SlickSlideTitle, SlickSlide );
SlickSlideTitle.prototype.buildChildElements = function( d ){
	var slide = '<div class="slickslide-title">';

	slide += '<div class="slickside-titletext">';
		if ( d.header_text !== undefined ) { slide += '<h1>' + d.header_text + '</h1>'; }
		if ( d.subhead_text !== undefined ) { slide += '<h4>' + d.subhead_text + '</h4>'; }
		if ( d.credit_text !== undefined ) { slide += '<p>' + d.credit_text + '</p>'; }
	slide += '</div>';

	return slide;
};

// full template slide
function SlickSlideFull( parentData, childData ){
	SlickSlide.call(this, parentData, childData );
	this.id   					= childData.id;
	this.pretty_id   			= childData.pretty_id;
	this.primary_type 			= childData.primary_type;
	this.primary_value 			= childData.primary_value;
	this.primary_background 	= childData.primary_background;
	this.primary_effect 		= childData.primary_effect;
	this.primary_effect_value 	= childData.primary_effect_value;
}
slickSlides.inheritSlide( SlickSlideFull, SlickSlide );
SlickSlideFull.prototype.buildChildElements = function( d ){
	var slide = '<div class="slickslide-full">';

	slide += d.buildSlideElement( d.primary_type, d.primary_value );

	slide += '</div>';

	return slide;
};

// half template slide
function SlickSlideHalf( parentData, childData ){
	SlickSlide.call(this, parentData, childData );
	this.variant						= childData.variant;
	this.half_segment_one_type 			= childData.half_segment_one_type;
	this.half_segment_one_value 		= childData.half_segment_one_value;
	this.half_segment_one_background 	= childData.half_segment_one_background;
	this.half_segment_one_effect_type 	= childData.half_segment_one_effect_type;
	this.half_segment_one_effect_value 	= childData.half_segment_one_effect_value;
	this.half_segment_two_type 			= childData.half_segment_two_type;
	this.half_segment_two_value 		= childData.half_segment_two_value;
	this.half_segment_two_background 	= childData.half_segment_two_background;
	this.half_segment_two_effect_type 	= childData.half_segment_two_effect_type;
	this.half_segment_two_effect_value 	= childData.half_segment_two_effect_value;
}
slickSlides.inheritSlide( SlickSlideHalf, SlickSlide );
SlickSlideHalf.prototype.buildChildElements = function( d ){
	var slide = '<div class="slickslide-half-';

	//add variant
	if ( d.variant === 'horizontal' ) { slide += 'horizontal">'; }
	else { slide += 'vertical">'; }

	//add segments and elements
	for ( var i = 0 ; i < 2 ; i++ ){
		slide += '<div class="slickslide-segment"';

		//background check
		switch(i){
			case 0:
				if ( d.half_segment_one_background ) { slide += 'style="background-color: ' + d.half_segment_one_background + '"'; }
				break;
			case 1:
				if ( d.half_segment_two_background ) { slide += 'style="background-color: ' + d.half_segment_two_background + '"'; }
				break;
		}


		slide += '>';
			switch(i){
				case 0:
					slide += d.buildSlideElement( d.half_segment_one_type, d.half_segment_one_value );
					break;
				case 1:
					slide += d.buildSlideElement( d.half_segment_two_type, d.half_segment_two_value );
					break;
			}

		slide += '</div>';
	}

	slide += '</div>';

	return slide;
};

// quarter template slide
function SlickSlideQuarter( parentData, childData ){
	SlickSlide.call(this, parentData, childData );
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
function SlickSlideCorner( parentData, childData ){
	SlickSlide.call(this, parentData, childData );
	this.variant				= childData.variant;
	this.primary_type 			= childData.primary_type;
	this.primary_value 			= childData.primary_value;
	this.primary_effect 		= childData.primary_effect;
	this.primary_effect_value 	= childData.primary_effect_value;
}
slickSlides.inheritSlide( SlickSlideCorner, SlickSlide );

// triplet template slide
function SlickSlideTriplet( parentData, childData ){
	SlickSlide.call(this, parentData, childData );
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
function SlickSlideDiagonal( parentData, childData ){
	SlickSlide.call(this, parentData, childData );
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
function SlickSlideCircular( parentData, childData ){
	SlickSlide.call(this, parentData, childData );
	this.primary_type 			= childData.primary_type;
	this.primary_value 			= childData.primary_value;
	this.primary_effect 		= childData.primary_effect;
	this.primary_effect_value 	= childData.primary_effect_value;
	
}
slickSlides.inheritSlide( SlickSlideCircular, SlickSlide );

/* Get the slide party started
==============================================================================================*/
$(document).ready(function(){
	slickSlides.loadJSON( slickSlides.JSON_files );
});



