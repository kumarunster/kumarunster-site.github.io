var scrollByClick;

(function($){
	$.migrateMute = true;
	$.migrateTrace = false;
	
	$("#logo").click(function(event){
		event.preventDefault();
		handleNavigation(this);
    });
	
	$("#navlinks li a").click(function(event){
		//handleNavigation(this);
		event.preventDefault();
		handleNavigation(this);
    });
    
    topMenu();
    
    $('#contactus_btn').click(function () {
        showContactForm();
    });
    
    //load and remove pinterest stuff
    $.getScript ('http://assets.pinterest.com/js/pinit.js')
    	.done(function(){
    		// $('[class*=_embed_pin_text]').remove();
    	});
	
}(jQuery));

function handleNavigation(navLink) {
	var href = $(navLink).attr('href');
	if(href.search('_anchor') != -1){
	    href = href.replace('_anchor', '_marker');
	    if($(href).length){
	        scrollByClick = href;
	        var offset = 70;
	        if($('.fixedNavbar').length == 0)
	        	offset = 200;
	        	
	        var position = $(href).offset().top;
	        $('body, html').animate({
	            scrollTop: position - offset
	            }, 500, function(){
	            scrollByClick = '';		
	        });
	        return false;
	    }
	}
	else
		window.location = href;
}


function topMenu(){
    var markers	= $('[id*="_marker"]');
    var $window = $(window); 
    $window.scroll(function(){
        var top = $window.scrollTop();
        w = $window.width();
        if(top > 15 && w > 768) {
            $("#navigation").addClass('fixedNavbar');
        } else {
            $("#navigation").removeClass('fixedNavbar');
            //on top
            $("#navlinks li").removeClass('active styler_parent_active');
        }
        markers.each(function(){
            var name_marker = '#' + $(this).attr('id');
            if(scrollByClick == name_marker || !scrollByClick) {
                var position = $(this).offset().top;
                var name_anchor = name_marker.replace('_marker', '_anchor');
                if(top >= position - $("#header .inner").height()){	
                	$("#navlinks li a[href='" + name_anchor + "']").closest('li').addClass('active styler_parent_active').siblings().removeClass('active styler_parent_active');
                	$("#navlinks select option[value='" + name_anchor + "']").attr('selected', true).siblings().attr('selected', false);
                }
                    
            }
        });
    });
	
}

function showContactForm() {
   var signupForm = $('#mc_embed_signup');
   
   signupForm.fadeToggle(400, function() {
       var position = signupForm.offset().top;
       var offset = 200;
       
       $("html, body").animate({ scrollTop: position - offset }, 200);
   });
       
}

