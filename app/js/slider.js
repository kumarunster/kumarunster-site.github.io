var w;
$(function(){	
    
    
    
    w = $(window).width();
    if($(".fullwidthbanner").length) {
        $('.fullwidthbanner').revolution({
            delay:9000,
            startheight:363,
            startwidth:960,

            navigationType:"both",					//bullet, thumb, none, both		(No Thumbs In FullWidth Version !)
            navigationArrows:"verticalcentered",		//nexttobullets, verticalcentered, none
            navigationStyle:"round",				//round,square,navbar

            touchenabled:"on",						// Enable Swipe Function : on/off
            onHoverStop:"on",						// Stop Banner Timet at Hover on Slide on/off

            navOffsetHorizontal:0,
            navOffsetVertical:20,

            stopAtSlide:-1,
            stopAfterLoops:-1,

            fullWidth:"on"							// Turns On or Off the Fullwidth Image Centering in FullWidth Modus
        });
    }
});
