'use strict';

var NEW_SLIDE_TEMPLATE="";
NEW_SLIDE_TEMPLATE += "    <div class=\"col slide\">";
NEW_SLIDE_TEMPLATE += "        <div class=\"card-panel white\">";
NEW_SLIDE_TEMPLATE += "          <div class=\"tinymce\">";
NEW_SLIDE_TEMPLATE += "              <h2><img title=\"TinyMCE Logo\" src=\"\/\/www.tinymce.com\/images\/glyph-tinymce@2x.png\" alt=\"TinyMCE Logo\" width=\"110\" height=\"97\" style=\"float: right\"\/>TinyMCE Inlite Theme<\/h2>";
NEW_SLIDE_TEMPLATE += "          <\/div> ";
NEW_SLIDE_TEMPLATE += "        <\/div>";
NEW_SLIDE_TEMPLATE += "    <\/div>";

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
    newSlide.attr('id',this.slides.children().length);
    tinymce.init({
      selector: 'div.tinymce',
      theme: 'inlite',
      plugins: 'image table link paste contextmenu textpattern autolink',
      insert_toolbar: 'quickimage quicktable',
      selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
      inline: true,
      paste_data_images: true,
      content_css: [
        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        '//www.tinymce.com/css/codepen.min.css'    
      ]
    });
    $('.tinymce h2').show();
  },
  get_html_content: function(){
    var arr = []
    for (var i = 0; i<this.slides.children().length; i++){
     arr.push(tinyMCE.get('mce_'+i).getContent());  //getting the content by id of a particular text  area
    }
    return arr
  },
  editingEnabled: true
};

$(document).ready(function() {

  $("body").keydown(function(e) {
    if(e.keyCode == 37 || ((e.shiftKey && e.keyCode == 9) )) { // shift+tab or left on left arrow
      e.preventDefault();
      Slides.prevSlide();
    }
    else if(e.keyCode == 39 || e.keyCode == 9) { // right on tab or right arrow
      e.preventDefault();
      Slides.newSlide();
      Slides.nextSlide();
    }
  });

  tinymce.init({
    selector: 'div.tinymce',
    theme: 'inlite',
    plugins: 'image table link paste contextmenu textpattern autolink autoresize',
    insert_toolbar: 'quickimage quicktable',
    selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
    inline: true,
    paste_data_images: true,
    width: '100%',
    height: '200px',
    content_css: [
      '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
      '//www.tinymce.com/css/codepen.min.css'    
    ]
  });

  $('.tinymce h2').show(); 
  
  $('#present-button').click(function(){
    console.log(Slides.get_html_content())
  });
});