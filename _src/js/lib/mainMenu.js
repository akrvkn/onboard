import {menuAppear, subMenuAppear, menuHide} from './animations';

let triggers = $('.js-main-menu-inner-trigger'),
	parents = $('.js-main-menu-inner'),
	menu = $('.js-menu-toggle'),
	body = $('html');

// на мобилке открывает дочерние меню
triggers.click(function(e) {
	e.preventDefault();
	parents.removeClass('opened');
	$(this).parents('.js-main-menu-inner').addClass('opened');
	subMenuAppear($(this).parents('.js-main-menu-inner'));
});


//показывает и скрывает меню
menu.click(function(e) {
	if (body.hasClass('menu-animation')) {
		e.preventDefault();
		return false;
	}
	if (body.hasClass('menu-visible')) {
		body.addClass('menu-animation');
		menuHide();
	} else {
		body.addClass('menu-animation');
		menuAppear();
	}
});
