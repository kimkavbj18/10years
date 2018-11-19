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
    }).on('beforeChange', (slick, currentSlide) => {
        const cSlide = currentSlide.currentSlide;

        $('.info-hero .random-color').each((k, el) => {
            const element = $(el);
            let colors = {
                '0': 'green',
                '1': 'blue',
                '2': 'red'
            };
            let prevColor = colors[cSlide], nextColor = (cSlide + 1 < Object.keys(colors).length) ? colors[cSlide + 1] : colors[0];
            if (element.prop('tagName') === 'A') {
                $(el).removeClass(`btn-${prevColor}`);
                $(el).addClass(`btn-${nextColor}`);
            } else {
                $(el).removeClass(`text-${prevColor}`);
                $(el).addClass(`text-${nextColor}`);
            }

        })

    });

    // $('.carousel-sample-design').slick({
    //     slidesToShow: 5,
    //     touchMove: true,
    // });

    $('.carousel-howtowork').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true, 
        speed: 500, 
        fade: false,
        prevArrow: '<i class="carousel-prev-btn fa fa-chevron-left"></i>',
        nextArrow: '<i class="carousel-next-btn fa fa-chevron-right"></i>',
        cssEase: 'linear'
    });

})(jQuery);