(function($){

    $('.main-menu .nav-item').on( 'click', function(){
        if ( $(this).hasClass('is-active') ) {
            $('.main-menu .nav-item').removeClass('is-active');
            $('body').removeClass('no-scroll');
        } else {
            $('.main-menu .nav-item').removeClass('is-active');
            $(this).addClass('is-active');
            $('body').addClass('no-scroll');
        }
    });

    $('button.hamburger').on( 'click', function(){
        $(this).toggleClass('is-active');
        $('.main-menu').toggleClass('is-active');
        $('body').toggleClass('no-scroll');
    });

})(jQuery);