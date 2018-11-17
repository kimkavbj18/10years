(function($){
    $('.carousel-domain-offers').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: '<i class="carousel-prev-btn fa fa-chevron-left"></i>',
        nextArrow: '<i class="carousel-next-btn fa fa-chevron-right"></i>',
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]
    });

    $('.carousel-webdesign-hero').slick({ 
        autoplay: true,
        dots: true, 
        arrows: false,
        infinite: true, 
        speed: 500, 
        fade: true, 
        cssEase: 'linear' 
    });

    $('.carousel-sample-design').slick({ 
        slidesToShow: 5,
        touchMove: true,
    });

    $('.carousel-howtowork').slick({ 
        infinite: true, 
        speed: 500, 
        fade: true, 
        prevArrow: '<i class="carousel-prev-btn fa fa-chevron-left"></i>',
        nextArrow: '<i class="carousel-next-btn fa fa-chevron-right"></i>',
        cssEase: 'linear'
    });

})(jQuery);