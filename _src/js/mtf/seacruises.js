
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
var get_company = parseUrlQuery('company')===''?9:parseUrlQuery('company');
var get_date_from = parseUrlQuery('date_from')===''?0:parseUrlQuery('date_from');
var base_url = 'https://www.mosturflot.ru/api/ajax/sea/companies/';
var ajax_url = 'https://www.mosturflot.ru/api/ajax/sea/companies/' + get_company + '.json';

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
        //filters
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                if($(".sort-by-offer.active" ).length > 0){
                    if(data[10]>0){
                        return true;
                    }

                }
                if($(".sort-by-sale.active" ).length > 0){
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
        );
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                //var cruisedays = 0;
                var datef = $('#date_from').val();
                var iFin = '' === datef ? 0 : parseInt( moment( datef, 'DD/MM/YYYY', 'ru', true ).format( 'x' ), 10 );
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
        $.fn.dataTable.ext.search.push(
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
        );
        moment.locale('ru');
        //Event listeners
        $('#date_from').on('change', function(){
            seacruises.draw();
        });
        $( ".sort-by-date" ).on( "click", function( event, ui ) {
            $(".sort-bar li").each(function(){
                var li = $(this);
                li.removeClass('active');
            });
            $( ".sort-by-date" ).addClass('active');
            seacruises.draw();
        } );

        $( ".sort-by-offer" ).on( "click", function( event, ui ) {
            $(".sort-bar li").each(function(){
                var li = $(this);
                li.removeClass('active');
            });
            $( ".sort-by-offer" ).addClass('active');
            seacruises.draw();
        } );

        $( ".sort-by-sale" ).on( "click", function( event, ui ) {
            $(".sort-bar li").each(function(){
                var li = $(this);
                li.removeClass('active');
            });
            $( ".sort-by-sale" ).addClass('active');
            seacruises.draw();
        } );

        $( ".sort-by-rus" ).on( "click", function( event, ui ) {
            $(".sort-bar li").each(function(){
                var li = $(this);
                li.removeClass('active');
            });
            $( ".sort-by-rus" ).addClass('active');
            seacruises.draw();
        } );
        $('#reset').on('click', function(){
            $("#direction, #date_from, #date_to, #ship").val("").change();
            $("#cruise-days").val("0").change();
            get_days = 0;
            get_company = '';
            $( ".sort-by-date" ).addClass('active');
            $( ".sort-by-rus" ).removeClass('active');
            $( ".sort-by-offer" ).removeClass('active');
            $( ".sort-by-sale" ).removeClass('active');
            //seacruises.ajax.url( ajax_url ).load();
            seacruises.columns().search( '' ).draw();
        });

        $.getJSON( "https://www.mosturflot.ru/api/ajax/sea/companies.json", function( data ) {
            var items = [];
            $.each( data, function( key, val ) {
                items.push( '<option value="' + val.id + '">'+ val.title + '</option>' );
            });

            $( "#company").html( items.join( "" )).change().on( 'change', function () {
                seacruises.ajax.url( base_url + this.value + '.json' ).load();
            });
        });

        $( "#price-range" ).on( "slidechange", function( event, ui ) {
            seacruises.draw();
        } );
        $('#cruise-days').on('change', function() { seacruises.draw();} );

        /*** all cruises **/
        var seacruises = $('#seacruises').DataTable( {
            "dom": 'rti<"clear">p',
            "infoCallback": function( settings, start, end, max, total, pre ) {
                $(".search-results-title b").text(total);
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
                    for ( var i=0, ien=json.data.length ; i<ien ; i++ ) {
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
                    return json.data;
                }
            },
            "language":ru_RU,
            "columns": [
                { "data": "date", "class": "m-row", responsivePriority: 6 },
                { "data": "assigned_ship.name", "class": "m-row-ship", responsivePriority: 0 },
                { "data": "nights", "class": "m-row-days", responsivePriority: 0 },
                { "data": "date_formatted", "class": "m-row-date", responsivePriority: 0 },
                { "data": "date_end_formatted", "class": "m-row-date", responsivePriority: 1 },
                { "data": "route", "class": "m-row", responsivePriority: 0 },
                { "data": "min_price", "class": "m-row-price", responsivePriority: 2 },
                { "data": "price_items.0.currency", "class": "m-row", responsivePriority: 3 },
                { "data": "region_id.name", "class": "m-row", responsivePriority: 4 },
                { "data": "offer", "class": "m-row", responsivePriority: 7 },
                { "data": "sale", "class": "m-row", responsivePriority: 8 }
            ],
            "columnDefs": [
                {
                    "targets": [ 0,8,9,10],
                    "visible": false,
                    "sortable": true
                },
                {
                    "targets": [ 1, 2, 3, 4, 5, 6, 7],
                    "visible": true,
                    "sortable": false
                },
                {
                    "render": function ( data, type, row ) {
                        return '<figure><img src="'+ row.assigned_ship.image +'" /></figure>'+ '<div class="shipname">' + row.assigned_ship.name + '</div>';
                    },
                    "targets": 1
                },
                {
                    "render": function ( data, type, row ) {

                        return '<a href="#" class="popup-seamap" data-box="' + row.cruise_id + '">' + row.route + '</a>';
                    },
                    "targets": 5
                },
                {
                    "render": function ( data, type, row ) {
                        return row.min_price + '<br><a href="/seacruises/details?' + row.cruise_id + '" class="button btn-small" target="_blank">ПОДРОБНЕЕ</a>';
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
