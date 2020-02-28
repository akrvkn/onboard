/**
 *  toggles class on defined element
 *  data-tgl="element selector"
 *  data-tgl-class="class to be toggled"
 */
$(document).on('click', '[data-tgl]', function(e) {
	e.preventDefault();
	let $c = $(this),
		$element = $($c.data('tgl'));
	if (!$element.length) {
		return false;
	}
	$element.toggleClass($c.data('tgl-class'));
	return false;
});
