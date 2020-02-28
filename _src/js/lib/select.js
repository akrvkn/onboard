import 'selectize';
import 'select2';
//import SimpleBar from 'simplebar';

//let $dropdowns = $('.js-drop'),
	//$bookSelect = $('.js-book-select'),
	//$form = $;

// главная селект в фильтре
////////////////////////////////////////$('.js-select').selectize();

// $('input').on('focus', function (e) {
// 	setTimeout(function () {
// 		window.scrollTo(0, 0);
// 		document.body.scrollTop = 0;
// 	}, 50);
// });

// селект в фильтре букинга
//$bookSelect.each(function() {
	//let $select = $(this),
		//$form = $select.parents('form'),
		//$parent = $select.parent();
	// console.log($select.parent());
	/**$select.select2(
		{
			minimumResultsForSearch: -1,
			placeholder: 'Сделайте выбор',
			dropdownParent: $parent,
			container: $parent
		}
	);*/
	// $parent.on('select2:blur', '.select2-search__field', function (e) {
	// 	$select.select2('close');
	// 	console.log('2:b');
	// });
	// $parent.on('focus','.select2-search__field', function(e){
	// 	$select.select2('open');
	// });

	//$form.on('reset', function() {
		//$select.val([]).trigger('change');
	//});
//});

//селет фильтра результатов поиска
function formatFilter(option) {
	if (!option.id) {
		return option.text;
	}
	let icon = $(option.element).data('select2Icon');

	var baseUrl = '/assets/img';
	var $state = $(
		'<span class="select2-filter-row"><img src="' + baseUrl + '/' + icon + '.svg" class="select2-filter-icon" /> <span class="select2-filter-text">' + option.text + '</span></span>'
	);
	return $state;
};

$('#header-filter').select2({
	templateResult: formatFilter,
	templateSelection: formatFilter,
	minimumResultsForSearch: -1,
	// dropdownCssClass: 'header-filter-dropdown',
	dropdownParent: $('#header-filter').parent()

});

// кастомный скролл в выпадающем списке
//$('select').not('#header-filter').on('select2:open', function(e) {
	//let results = $('.select2-results');
	//new SimpleBar(results[0]);
//});
