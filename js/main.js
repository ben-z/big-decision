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