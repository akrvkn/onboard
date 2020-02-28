import './affix';
import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

const $ranges = $('[data-book-range]');
const {noun} = require('plural-ru');


$ranges.each(function(index, item) {
	let $c = $(this),
		$form = $c.parents('form'),
		$inputs = $c.find('input.visible'),
		min = +$c.data('min'),
		max = +$c.data('max'),
		from = +$c.data('from'),
		to = +$c.data('to');

	let range = noUiSlider.create($c.find('.book-range-slider')[0], {
		start: [from, to],
		step: 1,
		connect: true,
		range: {
			'min': [min],
			'max': [max]
		}
	});

	console.log($c.find('.range_days'));

	$form.on('reset', function(event) {
		setTimeout(function() {
			$inputs.each(function(index, item) {
				let $c = $(item);
				if (index === 0) {
					inputUpdate($c, min);
					rangeUpdate();
					// inputChange($c, min, max);
				} else {
					inputUpdate($c, max);
					rangeUpdate();
					// inputChange($c, min, max);
				}
				$c.trigger('change');
			});
		},1);
	});

	$inputs.each(function(index, item) {
		let $c = $(item);
		if (index === 0) {
			inputUpdate($c, from);
		} else {
			inputUpdate($c, to);
		}
		$(this).focus(function() {
			inputFocus($(this));
		}).keyup(function() {
			inputKeyUp(this, min, max);
		}).on('change blur', function() {
			inputChange(this, min, max);
		});
	});

	range.on('slide', function(values, handle) {
		inputUpdate($inputs.eq(handle), +values[handle]);
	});

	if($c.find('.range_days').length > 0) {
		range.on('end', function () {
			//console.log($('input[name="days_from"]').val());
			filters.days_from = $('input[name="days_from"]').val();
			filters.days_to = $('input[name="days_to"]').val();
			filterAllData();
		});
	}
	if($c.find('.range_price').length > 0) {
		range.on('end', function () {
			//console.log($('input[name="price_from"]').val());
			filters.price_from = $('input[name="price_from"]').val();
			filters.price_to = $('input[name="price_to"]').val();
			console.log(filters);
			filterAllData();
		});
	}

	range.updateOptions({});
	function getSuff(dict, val) {
		return noun(val, ...dict);
	}

	function intBetween(i, min, max) {
		let val = min > i ? min : i;
		return max < val ? max : val;
	}

	function inputChange(input, min, max) {
		let $c = $(input),
			$hidden = $c.siblings('input'),
			val = intBetween(+$hidden.val(), min, max);
		inputUpdate($c, val);
		rangeUpdate();
	}

	function inputKeyUp(input, min, max) {
		let $c = $(input),
			$hidden = $c.siblings('input'),
			val = $c.val();
		val = +val.replace(/\D/g, '');
		val = intBetween(val, min, max);
		$hidden.val(val);
		$c.val(val);
	}

	function inputUpdate($input, val) {
		let hidden = $input.siblings('input');
		let pref = $input.data('pref');
		let suff = getSuff($input.data('suff'), val);
		let delimiter = $input.data('delimiter');
		let v = isNaN(+val) ? +$val.val() : +val;
		let format = wNumb({
			prefix: pref,
			thousand: delimiter,
			suffix: suff,
		});
		hidden.val(v);
		$input.val(format.to(v));
	}

	function inputBlur($input) {
		inputUpdate($input, $input.val());
	}

	function inputFocus($input) {
		let val = +$input.val();
		let $hidden = $input.siblings('input');
		$input.val($hidden.val());
	}
	function rangeUpdate() {
		let ranges = [];
		$inputs.each(function(index,value) {
			ranges[index]=+$(value).siblings('input').val();
		});
		range.set(ranges);
	}
});


