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

var NEW_SLIDE_TEMPLATE = `<div class="col s9 slide"><div class="card-panel white"><span>What's on your mind?</span></div></div>`;

var Slides = {
  currentSlideIdx: 0,
  slides: $($('.slides')[0]),
  currentTranslateOffset: null,
  nextSlide: function() {
    if (this.currentSlideIdx === this.slides.children().length - 1) return;
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
  },
  prevSlide: function() {
    if (this.currentSlideIdx === 0) return;
    --(this.currentSlideIdx);
    console.log(`Heading to slide: ${this.currentSlideIdx}`);
    var nextSlideOffset = $($('.slide')[this.currentSlideIdx + 1]).offset().left;
    var currentSlideOffset = $($('.slide')[this.currentSlideIdx]).offset().left;
    if (this.currentTranslateOffset === null) {
      this.currentTranslateOffset = prevSlideOffset;
    }
    this.currentTranslateOffset += nextSlideOffset - currentSlideOffset;
    console.log(`Translating ${this.currentTranslateOffset}px`);
    $('.slide').css('transform', `translateX(${this.currentTranslateOffset}px)`);
  },
  newSlide: function() {
    var newSlide = $(NEW_SLIDE_TEMPLATE);
    this.slides.append(newSlide);
    newSlide.css('transform', `translateX(${this.currentTranslateOffset}px)`);
  }
}

$(document).ready(function() {
  var currentSlideNum = 0;
  var slides = [
    
  ];
});