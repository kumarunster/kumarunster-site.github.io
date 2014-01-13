// JavaScript Document

$(function(){	
    
    
    infoDeviders();
	
})


$(window).resize(function(){
    infographBottom();	
})

$(window).load(function(){
    infographBottom();
    $('body').css('visibility', 'visible');
	processBox();
    initProgressBarWithImage();
    progress_bars();
    easePieChart();
    trends();
})



function infographBottom(){
    
    var h = 0;
    $('.infograph .desc').each(function(){
        var height = $(this).outerHeight();
        if(height > h) h = height;
    })
    if(h < 153) h = 153;
    $('#wrapper .infograph > sup').css('height', h);		
    
}
