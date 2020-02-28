
function parseUrlQuery(q) {
    let res = '';
    if(location.search) {
        let pair = (location.search.substr(1)).split('&');
        for(let i = 0; i < pair.length; i ++) {
            let param = pair[i].split('=');
            if(param[0]===q)
                res = decodeURIComponent(param[1]);
        }
    }
    return res;
}
var get_days = parseUrlQuery('days')===''? 0 : parseInt(parseUrlQuery('days'));
var get_company = parseUrlQuery('company')===''?9:parseInt(parseUrlQuery('company'));
var get_date_from = parseUrlQuery('dateFrom')===''?0:parseUrlQuery('dateFrom');
if( get_date_from.length > 0){
    var arrDate = get_date_from.split('.');
    var Y = parseInt(arrDate[2]);
    var M = parseInt(arrDate[1]) - 1;
    var D = parseInt(arrDate[0]);
    $('#date_from').datepicker().datepicker('setDate', new Date(Y, M, D));
}
var base_url = 'https://www.mosturflot.ru/api/ajax/sea/companies/';
var ajax_url = 'https://www.mosturflot.ru/api/ajax/sea/companies/' + get_company + '.json';
//console.log(ajax_url);
var ru_RU = {
    "processing": "Подождите...",
    "search": "Поиск:",
    "lengthMenu": "Показать _MENU_ записей",
    "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
    "infoEmpty": "Записи с 0 до 0 из 0 записей",
    "infoFiltered": "(отфильтровано из _MAX_ записей)",
    "infoPostFix": "",
    "loadingRecords": "Загрузка записей...",
    "zeroRecords": "Записи отсутствуют.",
    "emptyTable": "В таблице отсутствуют данные",
    "paginate": {
        "first": "Первая",
        "previous": "Назад",
        "next": "Вперёд",
        "last": "В конец"
    },
    "aria": {
        "sortAscending": ": активировать для сортировки столбца по возрастанию",
        "sortDescending": ": активировать для сортировки столбца по убыванию"
    }
};


/****** Plugins *************/

(function($){
    $(document).ready(function() {
        //if(window.location.pathname.indexOf('seacruises') !== -1) {
            const $seafilter = $('#sea-filter');
            $seafilter.on('change', function(){
                let order = $seafilter.val();

                if(order === '1') {
                    seacruises.order([0, 'asc']).draw();
                }
                if(order === '2') {
                    seacruises.order([0, 'desc']).draw();
                }
                if(order === '3') {
                    seacruises.order([11, 'asc']).draw();
                }
                if(order === '4') {
                    seacruises.order([11, 'desc']).draw();
                }
                if(order === '5') {
                    seacruises.order([10, 'asc']).draw();
                }
                if(order === '6') {
                    seacruises.order([0, 'desc']).draw();
                }
                if(order === '7') {
                    seacruises.order([9, 'desc']).draw();
                }
                if(order === '8') {
                    seacruises.order([9, 'desc']).draw();
                }

            });

       // }

        //filters
       /**$.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                let $filter = $('#header-filter').val();

                if($filter === 1){
                    if(data[10]>0){
                        return true;
                    }

                }
                if($filter === 2){
                    if(data[9]>0){
                        return true;
                    }

                }
                if($(".sort-by-date.active" ).length > 0){
                    return true;
                }

                if($(".sort-by-rus.active" ).length > 0){
                    return true;
                }
            }
        );*/
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                //var cruisedays = 0;
                var datef = $('#date_from').val();
                var iFin = '' === datef ? 0 : parseInt( moment( datef, 'MM/DD/YYYY', 'ru', true ).format( 'x' ), 10 );
                var tdate =  '' === data[0] ? 0 : parseInt( moment( data[0], 'YYYY-MM-DD', 'ru', true ).format( 'x' ), 10 );
                    //console.log(iFin + '--' + tdate);
                if (iFin < tdate) {
                    return true;
                }
            }
        );

        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                //var cruisedays = 0;
                var cruisedays = parseInt($('#cruise-days').val());

                var dd = parseInt( data[2] ) || 0; // use data for the days column

                if (( cruisedays === 0 ) || ( cruisedays === 14 && dd <= 14)|| ( cruisedays === 22 && dd <= 22 && dd > 14) || ( cruisedays === 23 && dd > 22 )) {
                    return true;
                }
            }
        );
        /**$.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                var prices = [];
                var price_range = $( "#price-range" );
                if(price_range.slider.length > 0){
                    prices = price_range.slider( "values");
                }
                var min = parseInt( prices[0], 10 );
                var max = parseInt( prices[1], 10 );
                var pr = parseFloat( data[6] ) || 0; // use data for the age column

                if ( ( isNaN( min ) && isNaN( max ) ) ||
                    ( isNaN( min ) && pr <= max ) ||
                    ( min <= pr   && isNaN( max ) ) ||
                    ( min <= pr   && pr <= max ) )
                {
                    return true;
                }
                return false;
            }
        );*/
        moment.locale('ru');
        //Event listeners
        $( "#date_from" ).datepicker();
        $('#date_from').on('change', function(){
            //console.log($('#date_from').val());
            seacruises.draw();
        });

        $('.book-reset').on('click', function(){
            $("#direction, #date_from, #ship").val("").change();
            $("#cruise-days").val("0").change();
            get_days = 0;
            get_company = '9';
            /**$( ".sort-by-date" ).addClass('active');
            $( ".sort-by-rus" ).removeClass('active');
            $( ".sort-by-offer" ).removeClass('active');
            $( ".sort-by-sale" ).removeClass('active');*/
            //seacruises.ajax.url( ajax_url ).load();
            seacruises.columns().search( '' ).draw();
        });

        $.getJSON( "https://www.mosturflot.ru/api/ajax/sea/companies.json", function( data ) {
            var items = [];
            var selected = '';
            $.each( data, function( key, val ) {
                if(val.id !== 174649) {
                    //console.log( val.id, get_company);
                    if(val.id === get_company){
                        selected = 'selected="selected"';
                    }else{
                        selected = '';
                    }
                    items.push('<option value="' + val.id + '" ' + selected + '>' + val.title + '</option>');
                }
            });

            $( "#company").html( items.join( "" )).change().on( 'change', function () {
                seacruises.ajax.url( base_url + this.value + '.json' ).load();
            });
        });

        /*$( "#price-range" ).on( "slidechange", function( event, ui ) {
            seacruises.draw();
        } );*/

        $('#cruise-days').on('change', function() { seacruises.draw();} );

        /*** all cruises **/
        let seacruises = $('#seacruises').DataTable( {
            "dom": 'rti<"clear">p',
            "infoCallback": function( settings, start, end, max, total, pre ) {
                $(".filter-results-count span").text(total);
                $(".book-submit-results").text(total);
                return "записи с " + start + " по "+ end + " из "+ total;
            },
            "responsive": "true",
            "ajax": {
                "url": ajax_url,
                "dataSrc": function ( json ) {
                    var ship_select = $('#ship').empty().append('<option value="">все лайнеры</option>');
                    var region_select = $('#region').empty().append('<option value="">все регионы</option>');
                    $("#region, #ship").val("").change();
                    var ships= {};
                    var regions = {};
                    var data = [];
                    for ( var i=0, ien=json.data.length ; i<ien ; i++ ) {
                        if(json.data[i].min_price > 0){
                            data.push(json.data[i]);
                        }
                        var d = json.data[i].assigned_ship.name;
                        var r = json.data[i].region_id.name;
                        if(!ships.hasOwnProperty(d)){
                            ships[d] = d;
                            ship_select.append('<option value="'+d+'">'+d+'</option>');
                        }
                        if(!regions.hasOwnProperty(r)){
                            regions[r] = r;
                            region_select.append('<option value="'+r+'">'+r+'</option>');
                        }

                    }
                    return data;
                }
            },
            "language":ru_RU,
            "columns": [
                { "data": "date", "class": "m-row", responsivePriority: 6 },
                { "data": "assigned_ship.name", "class": "m-row-ship", responsivePriority: 0 },
                { "data": "nights", "class": "m-row-days", responsivePriority: 0 },
                { "data": "date_formatted", "class": "m-row-date", responsivePriority: 0 },
                { "data": "date_end_formatted", "class": "m-row-date", responsivePriority: 1 },
                { "data": "route", "class": "m-row-route", responsivePriority: 0 },
                { "data": "min_price", "class": "m-row-price", responsivePriority: 2 },
                { "data": "price_items.0.currency", "class": "m-row", responsivePriority: 3 },
                { "data": "region_id.name", "class": "m-row", responsivePriority: 4 },
                { "data": "offer", "class": "m-row", responsivePriority: 7 },
                { "data": "sale", "class": "m-row", responsivePriority: 8 },
                { "data": "min_price", "class": "m-row-price", responsivePriority: 2 }
            ],
            "columnDefs": [
                {
                    "targets": [ 0,4,7,8,9,10,11],
                    "visible": false,
                    "sortable": true
                },
                {
                    "targets": [ 1, 2, 3, 5, 6],
                    "visible": true,
                    "sortable": false
                },
                {
                    "render": function ( data, type, row ) {
                        return '<span class=""><picture><a href="/seacruises/seacruise?tour=' + row.cruise_id + '" class="popup-seamap" data-box="' + row.cruise_id + '"><img src="'+ row.assigned_ship.image +'" /></a></picture></span><div class="shipname">' + row.assigned_ship.name + '</div>';
                    },
                    "targets": 1
                },
                /*{
                    "render": function ( data, type, row ) {

                        return '<a href="/seacruises/seacruise?tour=' + row.cruise_id + '" class="popup-seamap" data-box="' + row.cruise_id + '">' + row.route + '</a>';
                    },
                    "targets": 5
                },*/
                {
                    "render": function ( data, type, row ) {

                        return parseFloat( row.min_price );
                    },
                    "targets": 11
                },
                {
                    "render": function ( data, type, row ) {
                        return row.min_price + '&nbsp;<strong>' + row.price_items[0].currency + '</strong><br><a href="/seacruises/seacruise?tour=' + row.cruise_id + '" class="btn btn_common" target="_blank">ПОДРОБНЕЕ</a>';
                    },
                    "targets": 6
                }
            ],
            "initComplete": function () {
                this.api().columns(1).every( function () {
                    var column = this;

                    var selectel = $('#ship').empty().append('<option value="">все лайнеры</option>')
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );

                            column
                                .search( val ? '^'+val+'$' : '', true, false )
                                .draw();
                        } );
                    column.data().unique().sort().each( function ( d, j ) {
                        selectel.append( '<option value="'+d+'">'+d+'</option>' )
                    } );
                } );
                this.api().columns(8).every( function () {
                    var column = this;
                    var select = $('#region').empty().append('<option value="" selected="selected">все регионы</option>')
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );

                            column
                                .search( val ? '^'+val+'$' : '', true, false )
                                .draw();
                        } );
                    column.data().unique().sort().each( function ( d, j ) {
                        select.append( '<option value="'+d+'">'+d+'</option>' )
                    } );
                } );
            }

        } );


    } );
})(jQuery);
