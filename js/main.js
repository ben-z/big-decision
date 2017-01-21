'use strict';

var NEW_SLIDE_TEMPLATE = '<div class="col s9 slide"><div class="card-panel white"><span>What\'s on your mind?</span></div></div>';

var $;
var Slides = {
  currentSlideIdx: 0,
  slides: $($('.slides')[0]),
  currentTranslateOffset: null,
  nextSlide: function() {
    if (!this.editingEnabled) return;
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
    if (!this.editingEnabled) return;
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
    if (!this.editingEnabled) return;
    var newSlide = $(NEW_SLIDE_TEMPLATE);
    this.slides.append(newSlide);
    newSlide.css('transform', `translateX(${this.currentTranslateOffset}px)`);
  },
  editingEnabled: true
}

$(document).ready(function() {
  $("body").keydown(function(e) {
    if(e.keyCode == 37) { // left
      Slides.prevSlide();
    }
    else if(e.keyCode == 39) { // right
      Slides.nextSlide();
    }
  });
});
