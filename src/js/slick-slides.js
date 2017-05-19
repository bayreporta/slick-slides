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
	controls: 		{ 		/* stores variables for controlling slides */
		current: 	0, 		/* current ID of slide */ 
		left: 		null,   /* ID of slide to left */
		right: 		null, 	/* ID of slide to right */
		up: 		null, 	/* ID of slide above */
		down: 		null 	/* ID of slide below */

	},
	
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

			//add any additional styles to the slide
			slickSlides.slides[i].applyStyles();

			//if first slide, initialize directional data
			if ( i === 0 ){
				slickSlides.controls.left = 	slickSlides.slides[0].directions.left;
				slickSlides.controls.right = 	slickSlides.slides[0].directions.right;
				slickSlides.controls.up = 		slickSlides.slides[0].directions.up;
				slickSlides.controls.down = 	slickSlides.slides[0].directions.down;
			}
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
	},
	//determine slide direction and animate
	animateSlide:function( direction ){
		switch( direction ){
			case 37:
				//current slide moves right
				$( '.slickslide:eq(' + this.controls.current + ')' ).animate({
					left: 10000
				}, this.slides[this.controls.left].speed, function(){
					$( '.slickslide:eq(' + slickSlides.controls.current + ')' ).hide().css('left', 0);
					slickSlides.controls.current = slickSlides.controls.left;
					slickSlides.updateSlideControls( slickSlides.controls.current );

				} );

				//next slide fades in
				$( '.slickslide:eq(' + this.controls.left + ')' ).fadeIn(this.slides[this.controls.left].speed);
				break;
			case 39:
				//current slide moves left
				$( '.slickslide:eq(' + this.controls.current + ')' ).animate({
					left: -10000
				}, this.slides[this.controls.right].speed, function(){
					$( '.slickslide:eq(' + slickSlides.controls.current + ')' ).hide().css('left', 0);
					slickSlides.controls.current = slickSlides.controls.right;
					slickSlides.updateSlideControls( slickSlides.controls.current );
				} );

				//next slide fades in
				$( '.slickslide:eq(' + this.controls.right + ')' ).fadeIn(this.slides[this.controls.right].speed);
				break;
		}
	},
	//updates slide control data
	updateSlideControls:function( current ){
		var slide = this.slides[current].directions;
		if ( slide.left || slide.left === 0 ) { this.controls.left = slide.left; }
		if ( slide.right || slide.right === 0  ) { this.controls.right = slide.right; }
		if ( slide.up || slide.up === 0 ) { this.controls.up = slide.up; }
		if ( slide.down || slide.down === 0 ) { this.controls.down = slide.down; }
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
	if ( this.directions.left ) 	{ slide += 'data-slide-left="' + this.directions.left + '" '; }
	if ( this.directions.right ) 	{ slide += 'data-slide-right="' + this.directions.right + '" '; }
	if ( this.directions.up ) 		{ slide += 'data-slide-up="' + this.directions.up + '" '; }
	if ( this.directions.down ) 	{ slide += 'data-slide-down="' + this.directions.down + '" '; }

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
//apply any special styles to the slide as a whole, template based slides get their own treatment
SlickSlide.prototype.applyStyles = function(){
	//background of slide
	switch( this.background.type ){
		case 'color':
			$( '.slickslide:eq(' + this.id + ')' ).css( 'background-color', this.background.value );
			break;
	}
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
				if ( d.half_segment_one_background !== undefined ) { slide += 'style="background-color: ' + d.half_segment_one_background + '"'; }
				break;
			case 1:
				if ( d.half_segment_two_background !== undefined ) { slide += 'style="background-color: ' + d.half_segment_two_background + '"'; }
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

/* Watch for queues regarding 
==============================================================================================*/
$(document).on('keydown', function(event){
	event.preventDefault();
	slickSlides.animateSlide( event.which );
});

/* Get the slide party started
==============================================================================================*/
$(document).ready(function(){
	slickSlides.loadJSON( slickSlides.JSON_files );
});



