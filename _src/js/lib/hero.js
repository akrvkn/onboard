import Swiper from 'swiper';

let $hero = $('.js-hero');

if ($hero.length > 0) {
	let $bg = $hero.find('.js-hero-bg'),
		$content = $hero.find('.js-hero-content'),
		$pagination = $hero.find('.js-hero-pagination');
	
	let bg = new Swiper($bg, {
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 0,
		observeParents: true,
		observer: true,
		effect: 'fade',
		autoplay: {
			delay: 5000,
		},
		fadeEffect: {
			crossFade: false
		}
	});

	bg.on('observerUpdate',function() {
		bg.update();
	});

	let content = new Swiper($content, {
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 0,
		observeParents: true,
		observer: true,
		fade:true,
		controller: {
			control: bg,
			by: 'slide'
		},
		autoplay: {
			delay: 5000,
		},
		pagination:{
			el: $pagination,
			clickable: true
		}
	});

	content.on('observerUpdate',function() {
		bg.update();
	});
	content.on('paginationUpdate',function() {
		//bg.update();
		bg.autoplay.stop();
	});
}
