//import {TweenMax, TimelineLite} from 'gsap/TweenMax';
import { gsap } from "gsap";
import bp from './brakePoints';
let body = $('html');
export function menuAppear() {
	body.addClass('menu-visible');

	let tl = gsap.timeline();
	tl.add(gsap.fromTo('.js-main-menu',  {opacity: 0}, {duration: 0.2, opacity: 1}));


	tl.add(gsap.fromTo('.main-menu__child-item', {opacity: 0}, {duration: 0.1, opacity: 1}));
	tl.add(gsap.fromTo('.main-menu__child-item', {x: 10}, {duration: 0.1, x: 0}));
	tl.eventCallback('onComplete', function() {
		body.removeClass('menu-animation');
	});
}

export function menuHide() {
	let tl = gsap.timeline();
	tl.add(gsap.fromTo('.js-main-menu', {opacity: 1}, {duration: 0.4, opacity: 0}));
	tl.eventCallback('onComplete', function() {
		body.removeClass('menu-visible menu-animation');
	});
}

export function subMenuAppear($menu) {
	if (bp.current === 'phone') {
		let $items = $menu.find('.main-menu__child-item ').not(':first-child');
		let tl = gsap.timeline();
		tl.add(TweenMax.staggerFromTo($items, 0.15, {opacity: 0, x: 8}, {opacity: 1, x: 0}, 0.02));
	}
}


export default {menuAppear, subMenuAppear, menuHide};
