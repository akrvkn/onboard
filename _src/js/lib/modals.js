import magnificPopup from 'magnific-popup';
import {ajaxSubmit} from 'jquery-form';
import mask from 'jquery-mask-plugin';
import {getCookie, setCookie, deleteCookie} from "./cookies";
// $('[name=tel]').mask('+94 (999) 999 9999', {placeholder: ' '});
window.magnificPopup = magnificPopup;
window.closeModal = function() {
	$.magnificPopup.close();
};
// Add it after jquery.magnific-popup.js and before first initialization code
$.extend(true, $.magnificPopup.defaults, {
	tClose: 'Выход (Esc)', // Alt text on close button
	tLoading: 'Загрузка...', // Text that is displayed during loading. Can contain %curr% and %total% keys
	gallery: {
		tPrev: 'Назад (стрелка влево)', // Alt text on left arrow
		tNext: 'Вперед (стрелка вправо)', // Alt text on right arrow
		tCounter: '%curr% of %total%' // Markup for "1 of 7" counter
	},
	image: {
		tError: '<a href="%url%">Изображение</a> не найдено.' // Error message when image could not be loaded
	},
	ajax: {
		tError: '<a href="%url%">Контент</a> не найден.' // Error message when ajax request failed
	}
});

let $modals = $('.modals-holder');

$(document).on('click', '.js-modal-close, .mfp-close', function() {
	closeModal();
});


$('.js-ajax-form').on('submit', function(e) {
	e.preventDefault(); // prevent native submit
	const username = $('input[name="username"]').val();
	$(this).ajaxSubmit({
		dataType: 'json',
		contentType: "application/x-www-form-urlencoded",
        url: 'https://auth.mosturflot.ru/oauth/token',
        data: {grant_type: "password", client_id: "mtf-test", username: username, password: $('input[name="password"]').val()},
        method: 'post',
		success(responseText) {
			//console.log($('input[name="username"]').val());
			setCookie('mtf-user', username, {secure: true, 'max-age': 3600});
			showResponse(responseText);
			//showModal($('.js-modal_thanks'));
		},
		error(error) {
			console.log(error);
			//showModal($('.js-modal_error'));
		}
	});
});


function showResponse(responseText){
	//console.log(responseText);
	showModal($('.js-modal_welcome'));
}

// let $videoModals = $('.js-modal-video');
//
// if ($videoModals.length > 0) {
// 	$videoModals.magnificPopup({
// 		type: 'iframe',
// 		removalDelay: 200,
// 		mainClass: 'modal-slide-up mo_modal',
// 	});
// }

$(document).on('click', '[data-modal]', function(e) {
	e.preventDefault();
	e.stopPropagation();
	let $button = $(this).clone(),
		modalName = $button.data('modal'),
		callbacks,
		$modal = $modals.find('.js-modal_' + modalName),
		id;

	$modal.find('[data-mask]').each(function() {
		let $c = $(this),
			maskTemplate = $c.data('mask');
		$c.mask(maskTemplate);
	});

	showModal($modal);
	return false;
});

function showModal(modal, bg = true) {
	return $.magnificPopup.open({
		type: 'inline',
		items: {
			src: modal,
		},
		closeBtnInside: false,
		fixedContentPos: true,
		preloader: false,
		removalDelay: 200,
		closeMarkup: '<button title="%title%" class="mfp-close"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34"\n' +
			'\t viewBox="0 0 34 34">\n' +
			'\t<path fill="#cecece" transform="translate(-943 -121)"\n' +
			'\t\t  d="M976.597 123.343L961.94 138l14.655 14.656a1.374 1.374 0 0 1-1.942 1.942L960 139.942l-14.655 14.655a1.369 1.369 0 0 1-1.942 0 1.373 1.373 0 0 1 0-1.942l14.655-14.656-14.656-14.656a1.373 1.373 0 1 1 1.943-1.942L960 136.057l14.655-14.656a1.374 1.374 0 0 1 1.943 1.942z"/>\n' +
			'</svg></button>',
		//callbacks: callbacks || {},
		closeOnBgClick: bg,
		// callbacks examples below
		mainClass: 'modal-slide-up mo_modal',
		focus: 'input:first-child'
	});

	// }

}

window.showModal = showModal;

// let callbacksList = {
// 	beforeOpen: function() {
// 		console.log('Start of popup initialization');
// 	},
// 	elementParse: function(item) {
// 		// Function will fire for each target element
// 		// "item.el" is a target DOM element (if present)
// 		// "item.src" is a source that you may modify
//
// 		console.log('Parsing content. Item object that is being parsed:', item);
// 	},
// 	change: function() {
// 		console.log('Content changed');
// 		console.log(this.content); // Direct reference to your popup element
// 	},
// 	resize: function() {
// 		console.log('Popup resized');
// 		// resize event triggers only when height is changed or layout forced
// 	},
// 	open: function() {
// 		// console.log('Popup is opened');
// 	},
//
// 	beforeClose: function() {
// 		// Callback available since v0.9.0
// 		console.log('Popup close has been initiated');
// 	},
// 	close: function() {
// 		console.log('Popup removal initiated (after removalDelay timer finished)');
// 	},
// 	afterClose: function() {
// 		console.log('Popup is completely closed');
// 	},
//
// 	markupParse: function(template, values, item) {
// 		// Triggers each time when content of popup changes
// 		// console.log('Parsing:', template, values, item);
// 	},
// 	updateStatus: function(data) {
// 		console.log('Status changed', data);
// 		// "data" is an object that has two properties:
// 		// "data.status" - current status type, can be "loading", "error", "ready"
// 		// "data.text" - text that will be displayed (e.g. "Loading...")
// 		// you may modify this properties to change current status or its text dynamically
// 	},
// 	imageLoadComplete: function() {
// 		// fires when image in current popup finished loading
// 		// avaiable since v0.9.0
// 		console.log('Image loaded');
// 	},
//
//
// 	// Only for ajax popup type
// 	parseAjax: function(mfpResponse) {
// 		// mfpResponse.data is a "data" object from ajax "success" callback
// 		// for simple HTML file, it will be just String
// 		// You may modify it to change contents of the popup
// 		// For example, to show just #some-element:
// 		// mfpResponse.data = $(mfpResponse.data).find('#some-element');
//
// 		// mfpResponse.data must be a String or a DOM (jQuery) element
//
// 		console.log('Ajax content loaded:', mfpResponse);
// 	},
// 	ajaxContentAdded: function() {
// 		// Ajax content is loaded and appended to DOM
// 		console.log(this.content);
// 	}
// };
