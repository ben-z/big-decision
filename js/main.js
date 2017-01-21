var newElement = "<li class='current'>" +
					"<div class='input-fields'>" +
						"<input type='text' class='title' placeholder='Title'><textarea rows='4' cols='50' class='description' placeholder='Description'></textarea>" +
					"</div>" +
				 "</li>";

$(document).ready(function() {
	$('body').click(function() {

	});


	$('.description').keydown(function(e) {
	    var code = e.keyCode || e.which;

	    if (code === 9) {  
	        e.preventDefault();
	        		var newSlide = $('ul').append(newElement);
		$('ul').animate({ "left": "-=80%" }, "slow" );
	    }
	});
});

var BASE_CENTER_OFFSET = 0.125; // Base offset as a fraction of screen width

var Slides = {
  currentSlideIdx: 0,
  slides: [],
  currentTranslateOffset: null,
  nextSlide: function() {
    ++(this.currentSlideIdx);
    console.log(`Heading to slide: ${this.currentSlideIdx}`);
    var currentSlideOffset = $($('.slide')[this.currentSlideIdx]).offset().left;
    var prevSlideOffset = $($('.slide')[this.currentSlideIdx - 1]).offset().left;
    if (this.currentTranslateOffset === null) {
      this.currentTranslateOffset = prevSlideOffset;
    }
    this.currentTranslateOffset += -(currentSlideOffset - prevSlideOffset);
    console.log(`Translating ${this.currentTranslateOffset}px`);
    $('.slide').css('transform', `translateX(${this.currentTranslateOffset}px)`);
  }
}

$(document).ready(function() {
  var currentSlideNum = 0;
  var slides = [
    
  ];
});