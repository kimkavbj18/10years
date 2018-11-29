(function($){

    $(document).ready(function(){

        const w = $(window);

        if ( w.width() >= 992 ) {
            w.scroll(function(){

                if ( w.scrollTop() > 0 ){ 
                    $('header').addClass('header-white');
                    $('.cta-advertising').addClass('cta-advertising-white');
                }    
                else{
                    $('header').removeClass('header-white');
                    $('.cta-advertising').removeClass('cta-advertising-white');
                }   
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
    
        $('header button.hamburger').on( 'click', function(){
    
            let windowWidth = w.width();
            
            $(this).toggleClass('is-active');
            $('.main-menu').toggleClass('is-active');
    
            if ( windowWidth < 992 )
                $('body').toggleClass('no-scroll');
        });

        $('.nerdcom-platform-menu button.hamburger').on( 'click', function(){

            $(this).toggleClass('is-active');
            $('#platform .nav').toggleClass('is-active');

        });

        /**
         * CLOUDHOSTING Tabs
         */
        $('.tabBtn').on( 'click', function(){
            const btn = $(this);
            const toActivate = btn.data('to-activate');
            const role= btn.data('role');

            if ( typeof toActivate !== 'undefined' && typeof role !== 'undefined' ) {

                console.log(toActivate, role);

                $(`[data-role='${role}']`).removeClass('active');
                btn.addClass('active');

                $(`.${role}`).removeClass('active');
                $(`.${toActivate}`).addClass('active');
            }

        });


    });


})(jQuery);