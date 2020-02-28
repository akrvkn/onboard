import bp from './brakePoints';
import Swiper from 'swiper';

var tabs = require('tabs');
import './arrayIncludesPolyfill';

// make it tabbable!
var $tabs = $('.js-tabs');

$tabs.each((index, item) => {
	tabs(item);
	let $slider = $(item).find('.js-tabs-slider'),
		slides = $slider.find('.swiper-slide'),
		isSlider = false,
		slider;
	$slider.css('z-index', 7);
	// слайдер, который позволяет табам не входящим в экран скролиться
	function onResize() {
		if (['phone', 'phone-big'].includes(bp.current)) {
			if (isSlider) {
				slider.update();
				return;
			} else {
				slider = new Swiper($slider, {
					direction: 'horizontal',
					vertical: false,
					freeMode: true,
					spaceBetween: 20,
					slidesPerView: 'auto',
					mousewheel: {
						forceToAxis: true
					},
				});
				isSlider = true;

			}
		} else {
			if (isSlider) {
				slider.destroy(true, true);
				isSlider = false;
			}
		}
	}

	function onResize2() {
		slides.each(function() {
			let $c = $(this),
				inner = $c.find('.tab').outerWidth(true);
			$c.width(inner);
		});
	}

	$(window).on('bpChanged', onResize);
	$(window).on('resize', onResize2);
	onResize();
	onResize2();
	setTimeout(onResize,200);
});


$tabs.find('.btn_filter').click(function() {
	let $c = $(this),
		pane = $('#' + $c.attr('aria-controls'));
	pane.find('.filter-type').prop('disabled', false);
	pane.siblings().find('.filter-type').prop('disabled', true);
});
