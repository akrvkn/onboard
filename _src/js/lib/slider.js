import Swiper from 'swiper';

let $sliders = $('.js-slider');

$sliders.each(function() {
	let $c = $(this),
		perView = $c.data('per-view'),
		slider,
		timer,
		adaptive = {
			320: {
				slidesPerView: 1,
				slidesPerGroup: 1,
				autoHeight: true,
				spaceBetween: 20
			},
			// when window width is >= 480px
			480: {
				slidesPerView: 1,
				slidesPerGroup: 1,
				autoHeight: true,
				spaceBetween: 20
			},
			// when window width is >= 640px
			640: {
				slidesPerView: 1,
				slidesPerGroup: 1,
				autoHeight: true,
				spaceBetween: 20
			},
			// when window width is <= 768px
			767: {
				slidesPerView: 1,
				slidesPerGroup: 1,
				spaceBetween: 20,
				autoHeight: true
			},
			// when window width is <= 960px
			960: {
				slidesPerView: perView > 2 ? 2 : perView,
				slidesPerGroup: perView > 2 ? 2 : perView,
				spaceBetween: 30,
				// navigation: false
			},
			// when window width is <= 1195px
			1195: {
				slidesPerView: perView > 3 ? 3 : perView,
				slidesPerGroup: perView > 3 ? 3 : perView,
				spaceBetween: 30,
				// navigation: {
				// 	nextEl: $c.find('.js-slider-next'),
				// 	prevEl: $c.find('.js-slider-prev'),
				// },
			}
		};

	slider = new Swiper($c, {
		slidesPerView: perView,
		slidesPerGroup: perView,
		spaceBetween: 30,
		speed: 500,
		navigation: {
			nextEl: $c.find('.js-slider-next'),
			prevEl: $c.find('.js-slider-prev'),
		},
		pagination: {
			el: $c.find('.swiper-pagination'),
			type: 'bullets',
			clickable: true
		},
		breakpoints: adaptive
	});

	slider.on('resize', function() {
		clearTimeout(timer);

		timer = setTimeout(function() {
			slider.update();
		}, 200);
	});
});

