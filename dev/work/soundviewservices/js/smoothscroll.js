// Smooth scroll
    $(document).ready(function(){
        
        $('a.scrolldown').click(function(){
            if (window.matchMedia("(min-width: 1020px)").matches) {
            // the view port is at least 1020 pixels wide 
            
            var el = $(this).attr('href');
            var elWrapped = $(el);
            
            scrollToDiv(elWrapped,120);
            
            return false;
            }

            if (window.matchMedia("(min-width: 800px)").matches) {
            // the view port is at least 800 pixels wide 
            
            var el = $(this).attr('href');
            var elWrapped = $(el);
            
            scrollToDiv(elWrapped,100);
            
            return false;
            }

            if (window.matchMedia("(min-width: 640px)").matches) {
            // the view port is at least 640 pixels wide 
            
            var el = $(this).attr('href');
            var elWrapped = $(el);
            
            scrollToDiv(elWrapped,85);
            
            return false;
            }
            

            if (window.matchMedia("(min-width: 0px)").matches) {
            // the view port is at least 0 pixels wide 
            
            var el = $(this).attr('href');
            var elWrapped = $(el);
            
            scrollToDiv(elWrapped,70);
            
            return false;
            }
        });
        
        function scrollToDiv(element,navheight){
        
            var offset = element.offset();
            var offsetTop = offset.top;
            var totalScroll = offsetTop-navheight;
            
            $('body,html').animate({
                    scrollTop: totalScroll
            }, 750);
        
        }
        
        $(document).ready(function(){
    
        // hide #back-top first
        $("#back").hide();
        
        // fade in #back-top
        $(function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 350) {
                    $('#back').fadeIn();
                } else {
                    $('#back').fadeOut();
                }
            });
    
            // scroll body to 0px on click
            $('#back-top a').click(function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 400);
                return false;
            });
        });
    
    });
    
    });