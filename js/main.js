$(document).ready(function() {
	$('.description').keydown(function(e) {
	    var code = e.keyCode || e.which;

	    if (code === 9) {  
	        e.preventDefault();
	        alert('it works!');
	    }
	});
});