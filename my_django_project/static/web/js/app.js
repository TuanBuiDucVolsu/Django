if($('.box-slider .owl-carousel').length) {
    $('.box-slider .owl-carousel').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        dots: true,
        lazyLoad: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [],
        navElement: 'div',
        smartSpeed: 500,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });
}

if($('.product-item .owl-carousel').length) {
    $('.product-item .owl-carousel').owlCarousel({
        loop: false,
        margin: 4,
        nav: true,
        dots: false,
        lazyLoad: true,
        autoplay: false,
        autoplayHoverPause: true,
        navText: [],
        navElement: 'div',
        smartSpeed: 500,
        responsive: {
            0: {
                items: 4
            },
            600: {
                items: 4
            },
            1000: {
                items: 4
            }
        }
    });
}