(function($){

    $(document).ready(function(){

        const w = $(window);

        if ( w.width() >= 992 ) {
            w.scroll(function(){
                console.log( w.scrollTop() );

                if ( w.scrollTop() > 0 )
                    $('header').addClass('header-white');
                else
                    $('header').removeClass('header-white');

            });
        }

        $('.main-menu .nav-item').on( 'click', function(e){

            let windowWidth = w.width();

            if ( windowWidth < 992 && e.type === 'click' ) {
                if ( $(this).hasClass('is-active') ) {
                    $('.main-menu .nav-item').removeClass('is-active');
                } else {
                    $('.main-menu .nav-item').removeClass('is-active');
                    $(this).addClass('is-active');
                }
            }
            
        });
    
        $('button.hamburger').on( 'click', function(){
    
            let windowWidth = w.width();
            
            $(this).toggleClass('is-active');
            $('.main-menu').toggleClass('is-active');
    
            if ( windowWidth < 992 )
                $('body').toggleClass('no-scroll');
        });

    });


})(jQuery);