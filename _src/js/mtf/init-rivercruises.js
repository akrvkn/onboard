import './affix';
import noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import 'selectize';

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
            //console.log(filters);
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
/****** end range *******/


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

const showSkidki = parseUrlQuery('skidki') === '' ? false : parseUrlQuery('skidki');
const showSpecialOffers = parseUrlQuery('offers') === '' ? false : parseUrlQuery('offers');
const showShip = parseUrlQuery('ship') === '' ? '' : parseUrlQuery('ship');
const showDir = parseUrlQuery('direction') === '' ? '' : parseUrlQuery('direction');
const showDateFrom = parseUrlQuery('dateFrom') === '' ? '' : parseUrlQuery('dateFrom');
const showDateTo = parseUrlQuery('dateTo') === '' ? '' : parseUrlQuery('dateTo');

//let $tours = $('.tours');
const $tours = $('#tours').empty().html('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');
let $more = $('.btn_more');
let $form = $('#rivercruises_filter');
let $bookSelect = $('.js-book-select');
let $headerFilter = $('#header-filter');


let page = 1,
    perpage = 20,
    dbdata,
    filtered,
    counter = 0,
    filters = {
        //datefrom: moment().format('YYYY-MM-DD'),
        //dateto: moment().add('1', 'years').format('YYYY-MM-DD'),
        days_from: 0,
        days_to: 1000,
        date_from: '',
        date_to: '',
        price_from: 0,
        price_to: 200000,
        ships: [],
        cities: [],
        shipclass: 0,
        direction: 0,
        cityfrom: '',
        cityto: '',
        skidka: showSkidki,
        spec: showSpecialOffers,
        holyday: false,
        mtf: false,
        buy_online: false,
        intourist: false
    },
    ships = {},
    shipClasses = [],
    classnum = [],
    shipsclasses = {},
    imgs = {},
    cities = [],
    pointsfrom = [],
    pointsto = [],
    select_ships = [],
    sorted_ships = {},
    select_class = [],
    select_directions = [],
    select_cities = [],
    select_pointfrom = [],
    select_pointto = [];

if( showShip !== '' && parseInt(showShip) !== 0){
    filters.ships.push(parseInt(showShip));
}

if( showDir !== ''){
    filters.direction = showDir;
}

if( showDateFrom !== ''){
    filters.date_from = showDateFrom;
}

if( showDateTo !== ''){
    filters.date_to = showDateTo;
}

function resetFilters() {
    filters = {
        days_from: 0,
        days_to: 1000,
        date_from: '',
        date_to: '',
        price_from: 0,
        price_to: 200000,
        ships: [],
        cities: [],
        shipclass: 0,
        direction: 0,
        cityfrom: '',
        cityto: '',
        skidka: false,
        spec: false,
        holyday: false,
        mtf: false,
        buy_online: false,
        intourist: false
    };
    page = 1;
    counter = 0;
    filterAllData();
}



function initRiverData(cb) {
    let d = new Date();
    let current_date = d.toISOString().substring(0, 10);
    let url = 'https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=ship-id,route,start,finish,days,price-from,price-from-discount,is-special-offer,start-point,finish-point,max-discount,is-online-sale,is-foreigner,is-holiday,direction-id,is-own,discount-expire,start-point,finish-point&include=ship,ship-title-image,direction&fields[ships]=name,class-id,sort-order,is-own&filter[start][gte]=' + current_date + 'T00:00:00Z&per-page=100000';
    //https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=ship-id,route,start,finish,days,price-from,price-from-discount,is-special-offer,start-point,end-point,max-discount,is-online-sale,is-foreigner,is-holiday,direction-id,is-own,discount-expire,start-point,finish-point&include=ship,ship-title-image,direction&fields[ships]=name,class-id,sort-order,is-own&filter[start][gte]=2020-05-17T00:00:00Z&per-page=20
    let revision = '01';

    let isLocalStorage = 'localStorage' in window && window['localStorage'] !== null,
        request,
        apiToursData,
        MTFData,
        parseJson = function(json){
            return JSON.parse(json);
        },
        storeIT = function () {
            MTFData = parseJson(apiToursData);
            if(MTFData) {
                dbdata = MTFData.data;
                $.map(MTFData.included, function (meta, i) {
                    if (meta.hasOwnProperty('type')) {
                        if (meta.type === 'ships') {
                            ships[meta.id] = meta.attributes.name;
                            //select_ships.push({id: meta.id, text: meta.attributes.name});
                            sorted_ships[meta.attributes['sort-order']] = {id: meta.id, text: meta.attributes.name};
                            //console.log(meta.attributes['class-id'] + '--' + meta.attributes.name);
                            if(meta.attributes['class-id'] !== null) {
                                shipsclasses[meta.id] = meta.attributes['class-id'];
                                if(classnum.indexOf(meta.attributes['class-id']) === -1) {
                                    classnum.push(meta.attributes['class-id']);
                                    select_class.push({
                                        id: meta.attributes['class-id'],
                                        text: shipClasses[meta.attributes['class-id']]
                                    });
                                }
                            }
                        }
                        if (meta.type === 'ship-images') {
                            imgs[meta.attributes['ship-id']] = meta.links['image-url'];
                        }
                        if (meta.type === 'directions') {
                            select_directions.push({id: meta.id, text: meta.attributes.name, order: meta.attributes['sort-order']});
                        }
                    }
                    if (MTFData.included.length === i + 1) {
                        /*select_ships.sort(function(a,b){
                            let x=a.text.toLowerCase(),
                                y=b.text.toLowerCase();
                            return x<y ? -1 : x>y ? 1 : 0;
                        });*/
                        const $select_riverships = $('#select_riverships');
                        const $search_riverships = $('select[name="ship"]').empty().html('<option value="0">Теплоход</option>');
                        //select_ships.splice(0, 0, {id:0, text:"Теплоход"});
                        $.map(sorted_ships, function(dir, ix){
                            let opt = '<option value="' + dir.id + '">' + dir.text + '</option>';
                            $search_riverships.append(opt);
                            select_ships.push(dir);
                        });

                        $select_riverships.select2({
                            minimumResultsForSearch: -1,
                            placeholder: 'Выберите теплоходы',
                            dropdownParent: $select_riverships.parent(),
                            container: $select_riverships.parent(),
                            data: select_ships
                        }).on('select2:select', function (e) {
                            filters.ships.push(e.params.data.id);
                            filterAllData();
                        }).on('select2:unselect', function (e) {
                            let index = filters.ships.indexOf(e.params.data.id);
                            if (index > -1) {
                                filters.ships.splice(index, 1);
                            }
                            filterAllData();
                        });
                        const $select_shipclass = $('#select_shipclass');
                        /*select_class.sort(function(a,b){
                            return a.id - b.id;
                        });
                        console.log(select_class);
                        $.each(select_class, function(index, s_class){
                            s_class.text = classes[index];
                        });*/
                        //console.log(select_class);
                        select_class.splice(0, 0, {id:0, text:" Все"});
                        $select_shipclass.select2({
                            minimumResultsForSearch: -1,
                            placeholder: 'Класс теплохода',
                            dropdownParent: $select_shipclass.parent(),
                            container: $select_shipclass.parent(),
                            data: select_class
                        }).on('select2:select', function (e) {
                            filters.shipclass = e.params.data.id;
                            filterAllData();
                        });
                    }
                });

                $.map(MTFData.data, function(trip, index){
                    let route_arr = trip.attributes.route.split(' - ');
                    if(route_arr[0].indexOf('Москва') > -1){
                        route_arr.splice(0,1, 'Москва');
                    }
                    if(route_arr[route_arr.length - 1].indexOf('Москва') > -1){
                        route_arr.splice(route_arr.length - 1,1, 'Москва');
                    }
                    if(route_arr[0].indexOf('Петербург') > -1){
                        route_arr.splice(0,1, 'Санкт-Петербург');
                    }
                    if(route_arr[route_arr.length - 1].indexOf('Петербург') > -1){
                        route_arr.splice(route_arr.length - 1,1, 'Санкт-Петербург');
                    }
                    if(route_arr[0].indexOf('Новгород') > -1){
                        route_arr.splice(0,1, 'Н.Новгород');
                    }
                    if(route_arr[route_arr.length - 1].indexOf('Новгород') > -1){
                        route_arr.splice(route_arr.length - 1,1, 'Н.Новгород');
                    }
                    for(let j=0;j<route_arr.length;j++) {
                        if (cities.indexOf(route_arr[j]) === -1 && route_arr[j].indexOf('В пути') === -1 && route_arr[j].indexOf('в море') === -1){
                            cities.push(route_arr[j]);
                            select_cities.push({id: route_arr[j], text: route_arr[j]});
                        }
                    }

                    if(pointsfrom.indexOf(route_arr[0]) === -1){
                        pointsfrom.push(route_arr[0]);
                        select_pointfrom.push({id: route_arr[0], text: route_arr[0] });
                    }

                    if(pointsto.indexOf(route_arr[route_arr.length - 1]) === -1){
                        pointsto.push(route_arr[route_arr.length - 1]);
                        select_pointto.push({id: route_arr[route_arr.length - 1], text: route_arr[route_arr.length - 1] });
                    }


                    if (MTFData.data.length === index + 1) {
                        const $select_cities =  $('#select_cities');
                        select_cities.sort(function(a,b){
                            var x=a.text.toLowerCase(),
                                y=b.text.toLowerCase();
                            return x<y ? -1 : x>y ? 1 : 0;
                        });
                        select_cities.splice(0, 0, {id:0, text:"Все"});
                        $select_cities.select2({
                            minimumResultsForSearch: -1,
                            placeholder: 'Выберите стоянки',
                            dropdownParent: $select_cities.parent(),
                            container: $select_cities.parent(),
                            data: select_cities
                        }).on('select2:select', function (e) {
                            filters.cities.push(e.params.data.id);
                            filterAllData();
                        }).on('select2:unselect', function (e) {
                            let index = filters.cities.indexOf(e.params.data.id);
                            if (index > -1) {
                                filters.cities.splice(index, 1);
                            }
                            filterAllData();
                        });

                        /*** select points ****/
                        const $select_pointfrom = $('#select_pointfrom');
                        select_pointfrom.sort(function(a,b){
                            var x=a.text.toLowerCase(),
                                y=b.text.toLowerCase();
                            return x<y ? -1 : x>y ? 1 : 0;
                        });
                        select_pointfrom.splice(0, 0, {id:0, text:"Любой"});
                        $select_pointfrom.select2({
                            minimumResultsForSearch: -1,
                            placeholder: 'Отправление из',
                            dropdownParent: $select_pointfrom.parent(),
                            container: $select_pointfrom.parent(),
                            data: select_pointfrom
                        }).on('select2:select', function (e) {
                            filters.cityfrom = e.params.data.id;
                            filterAllData();
                        }).on('select2:unselect', function () {
                            filters.cityfrom = '';
                            filterAllData();
                        });

                        const $select_pointto = $('#select_pointto');
                        select_pointto.sort(function(a,b){
                            var x=a.text.toLowerCase(),
                                y=b.text.toLowerCase();
                            return x<y ? -1 : x>y ? 1 : 0;
                        });
                        select_pointto.splice(0, 0, {id:0, text:"Любой"});
                        $select_pointto.select2({
                            minimumResultsForSearch: -1,
                            placeholder: 'Конечный пункт',
                            dropdownParent: $select_pointto.parent(),
                            container: $select_pointto.parent(),
                            data: select_pointto
                        }).on('select2:select', function (e) {
                            filters.cityto = e.params.data.id;
                            filterAllData();
                        }).on('select2:unselect', function () {
                            filters.cityto = '';
                            filterAllData();
                        });

                        const $select_direction = $('#select_direction');
                        const $search_direction = $('select[name="direction"]').empty();
                        select_directions.sort(function(a,b){
                            var x=a.order,
                                y=b.order;
                            return x<y ? -1 : x>y ? 1 : 0;
                        });
                        select_directions.splice(0, 0, {id:0, text:"Направления"});
                        $.map(select_directions, function(dir, ix){
                            let opt = '<option value="' + dir.id + '">' + dir.text + '</option>';
                            $search_direction.append(opt);
                            if( ix + 1 === select_directions.length){
                                $('.js-select').selectize();
                            }
                        });

                        $select_direction.select2({
                            minimumResultsForSearch: -1,
                            placeholder: 'Выберите направление',
                            dropdownParent: $select_direction.parent(),
                            container: $select_direction.parent(),
                            data: select_directions
                        }).on('select2:select', function (e) {
                            filters.direction = e.params.data.id;
                            filterAllData();
                        });
                        //document.getElementById("mtf_ships").checked = true;
                        //window.location.search.indexOf('direction') === -1 && window.location.search.indexOf('ship') === -1 && window.location.search.indexOf('dateFrom') === -1 && window.location.search.indexOf('dateTo') === -1
                        if(+showShip === 0) {
                            $("#mtf_ships").prop("checked", true);
                            filters.mtf = true;
                        }

                    }
                });

                cb();
            }
        };

    if (isLocalStorage && localStorage.getItem('revisionETag') !== null) {
        revision = localStorage.getItem('revisionETag');
    }

    try {
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader("If-None-Match", revision);
        request.onload = function () {
            console.log(request.status);
            switch (request.status) {
                case 200:
                    apiToursData = request.responseText;
                    storeIT();
                    if (isLocalStorage) {
                        localStorage.setItem('inlineToursData', apiToursData);
                        localStorage.setItem('revisionETag', request.getResponseHeader('ETag'));
                    }
                    break;
                case 304:
                    apiToursData = localStorage.getItem('inlineToursData');
                    storeIT();
                    break;
                default:
                    if (isLocalStorage) {
                        apiToursData = localStorage.getItem('inlineToursData');
                    }
            }
        };
        request.send();
    } catch (e) {
    }
}

$form.on('reset', function() {
    $bookSelect.each(function() {
        let $select = $(this);
        $select.val([]).trigger('change');
    });
    resetFilters();
});

$form.on('submit', function(e) {
    e.preventDefault();
    renderTours(filtered);
    $('body').removeClass('show-filter');
});


function renderTours(data) {
    //console.log(data.length);
    $tours.empty();
    $('.filter-results-count span').html(data.length);
    $('.book-submit-results').html(data.length);

    if (page * perpage >= data.length) {
        $more.hide();
    }else {
        $more.show();
    }
    $.map(data, function (tour, ix) {
        //&& counter >= (page - 1) * perpage

        if (ix < page * perpage) {
            //console.log(counter, ix);
            //counter++;
            let priceList = '';
            let skidka = '';
            let tourDays = ' (' + tour.attributes.days + ' дней)';
            let a = moment();
            let b = moment();
            if(tour.attributes['discount-expire'] !== null) {
                a = moment(tour.attributes['discount-expire'], moment.ISO_8601);
            }
            if(tour.attributes['max-discount'] > 0 && a.isAfter(b) ){
               //let newPrice = parseInt(tour.attributes['price-from']);
               skidka = '<span class="tours-item__skidka">- ' + tour.attributes['max-discount'] + ' %</span>';
               //let oldPrice = newPrice + newPrice*parseInt(tour.attributes['max-discount'])/100;
               //priceList = '<span class="tours-item__prices"><span>' + tour.attributes['price-from'] + ' руб.</span><s>' + oldPrice + '</s></span>';
                priceList = '<span class="tours-item__prices"><span>' + tour.attributes['price-from'] + ' руб.</span></span>';
            }else{
                priceList = '<span class="tours-item__title"><span>' + tour.attributes['price-from'] + ' руб.</span></s></span>';
            }
            if( parseInt(tour.attributes.days) < 5){
                tourDays = ' (' + tour.attributes.days + ' дня)';
            }
            $tours.append('<li class="tours__item"><a href="/rivercruise/?ship=' + tour.attributes['ship-id'] + '&tour=' + tour.id + '" class="tours-item" target="_blank"><span class="tours-item__img">\n' +
                '<picture><img src="' + imgs[tour.attributes['ship-id']] + '" alt="теплоход"></picture>' + skidka + '</span>\n' +
                '<span class="tours-item__content">\n' +
                '<span class="tours-item__date">' + moment(tour.attributes.start).format('DD MMMM') + '-' + moment(tour.attributes.finish).format('DD MMMM YYYY') + tourDays + '</span>\n' +
                '<span class="tours-item__title">' + ships[tour.attributes['ship-id']] + '</span>\n' +
                '<span class="tours-item__text">' + tour.attributes.route + '</span>\n' + priceList +
                '</span></a></li>');
        }
        if (data.length === ix + 1 && page * perpage < data.length) {
            page++;
        }


    });
}

$more.on('click', function () {
    renderTours(filtered);
});

$("#only_holyday").on('change',function() {
    filters.holyday = this.checked;
    filterAllData();
});

$("#buy_online").on('change',function() {
    filters.buy_online = this.checked;
    filterAllData();
});

if(showSkidki){
    $("#only_skidki").prop('checked', true);
}

if(showSpecialOffers){
    $("#special_offers").prop('checked', true);
}

$("#special_offers").on('change',function() {
    filters.spec = this.checked;
    filterAllData();
});

//document.getElementById("mtf_ships").checked = true;

$("#mtf_ships").on('change',function() {
    filters.mtf = this.checked;
    filterAllData();
});

$("#intourist").on('change',function() {
    filters.intourist = this.checked;
    filterAllData();
});

$("#only_skidki").on('change', function() {
    filters.skidka = this.checked;
    filterAllData();
});

$("#date_out").on('change', function() {
    filters.date_from = $(this).val().substr(0, 10);
    filterAllData();
});

$("#date_in").on('change', function() {
    filters.date_to = $(this).val().substr(0, 10);
    filterAllData();
});


function filterDateFrom(date) {
    let a = moment(date, moment.ISO_8601);
    if (filters.date_from !== '') {
        return moment(filters.date_from, 'DD.MM.YYYY') < a;
    }else{
        return true;
    }
}

function filterDateTo(date) {
    let a = moment(date, moment.ISO_8601);
    if (filters.date_to !== '') {
        return moment(filters.date_to, 'DD.MM.YYYY') > a;
    }else{
        return true;
    }
}

function filterClass(ship) {
    if (parseInt(filters.shipclass) !== 0) {
            return parseInt(filters.shipclass) === parseInt(shipsclasses[ship]);
        }else{
            return true;
        }
    }


function filterShips(ship) {
    if (filters.ships.length !== 0) {
        for (let i = 0; i < filters.ships.length; i++) {
            if (parseInt(filters.ships[i]) === ship) {
                return true;
            }
        }
    }else{
        return true;
    }
    return false;
}

function filterCities(route) {
    let found = false;
    if (filters.cities.length !== 0) {
        for (let i = 0; i < filters.cities.length; i++) {
            found = route.indexOf(filters.cities[i]) > -1;
            if(found === false){
                return false;
            }
        }
        return found;
    }else{
        return true;
    }
}

function filterPointFrom(route) {
    let route_arr = route.split(' - ');
    if(filters.cityfrom === '' || filters.cityfrom === '0'){
        return true;
    }else {
        return route_arr[0].indexOf(filters.cityfrom) > -1;
    }
}

function filterPointTo(route) {
    let route_arr = route.split(' - ');
    if(filters.cityto === '' || filters.cityto === '0'){
        return true;
    }else {
        return route_arr[route_arr.length - 1].indexOf(filters.cityto) > -1;
    }
}

function filterDirection(dir){
    //console.log(route.indexOf(filters.direction));
    if(parseInt(filters.direction) === 0 || parseInt(dir) === 0 ){
        return true;
    }else {
        //console.log(dir, filters.direction);
        return parseInt(filters.direction) === parseInt(dir);
    }
}

function filterPrice(price){
    if(filters.price_from === 0 && filters.price_to === 2000000){
        return true;
    }else {
        return parseInt(price) > parseInt(filters.price_from) && parseInt(price) < parseInt(filters.price_to);
    }
}

function filterDays(from, to){
    let a = moment(from, moment.ISO_8601);
    let b = moment(to, moment.ISO_8601);
    let days = b.diff(a, 'days') + 1;
    if(filters.days_from === 0 && filters.days_to === 1000){
        return true;
    }else {
        return parseInt(days) > parseInt(filters.days_from) && parseInt(days) < parseInt(filters.days_to);
    }
}

function filterHoliday(holiday){
    if(filters.holyday === false){
        return true;
    }else{
        return filters.holyday === holiday;
    }
}

function filterBuyOnline(online){
    if(filters.buy_online === false){
        return true;
    }else{
        return filters.buy_online === online;
    }
}

function filterSpecOffers(spec){
    if(filters.spec === false){
        return true;
    }else{
        return spec;
    }
}

function filterSkidki(skidka, expire){
    let a = moment();
    let b = moment();
    if(expire !== null) {
        a = moment(expire, moment.ISO_8601);
    }
    if(filters.skidka === false){
        return true;
    }else{
        return (skidka > 0 && a.isAfter(b));
    }
}

function filterMtfShips(ship){
    const mtf_ships = [5,14,19,36,72,91,92,139,150,198,200,206,207,247];
    if(filters.mtf === false){
        return true;
    }else{

        return mtf_ships.indexOf(ship) > -1;
    }
}

function filterIntourists(intourist){
    if(filters.intourist === false){
        return true;
    }else{
        return filters.intourist === intourist;
    }
}


function filterAllData() {
    //console.log(filters.cities);
    filtered = [];
    for (let i = 0; i < dbdata.length; i++) {
        if (filterShips(dbdata[i].attributes['ship-id']) && filterCities(dbdata[i].attributes['route']) && filterPointFrom(dbdata[i].attributes['route']) && filterPointTo(dbdata[i].attributes['route']) && filterDirection(dbdata[i].attributes['direction-id']) && filterClass(dbdata[i].attributes['ship-id']) && filterPrice(dbdata[i].attributes['price-from']) && filterDays(dbdata[i].attributes['start'], dbdata[i].attributes['finish']) && filterHoliday(dbdata[i].attributes['is-holiday']) && filterBuyOnline(dbdata[i].attributes['is-online-sale']) && filterSpecOffers(dbdata[i].attributes['is-special-offer']) && filterMtfShips(dbdata[i].attributes['ship-id']) && filterIntourists(dbdata[i].attributes['is-foreigner']) && filterSkidki(dbdata[i].attributes['max-discount'], dbdata[i].attributes['discount-expire']) && filterDateFrom(dbdata[i].attributes['start']) && filterDateTo(dbdata[i].attributes['start'])){
            filtered.push(dbdata[i]);
        }
    }
    page = 1;
    counter = 0;
    $tours.empty();
    sortAllData();
    //renderTours(filtered);

}

if(window.location.pathname.indexOf('rivercruises') !== -1) {
    $headerFilter.on('change', function () {
        //console.log($(this).val());
        sortAllData();

    });
}

function sortAllData(){
    let order = parseInt($headerFilter.val());
    switch(order){
        case 1:
            sortDatesASC();
            break;
        case 2:
            sortDatesDESC();
            break;
        case 3:
            sortPriceDESC();
            break;
        case 4:
            sortPriceASC();
            break;
        case 5:
            sortSkidkiDESC();
            break;
        case 6:
            sortSkidkiASC();
            break;
        case 7:
            sortDaysDESC();
            break;
        case 8:
            sortDaysASC();
            break;
        default:
            break;
    }
}

function sortDatesASC(){
    filtered.sort(function(a,b){
        if(a.attributes.start > b.attributes.start){
            return 1;
        }
        if(a.attributes.start < b.attributes.start){
            return -1;
        }
        return 0;
    });
    page = 1;
    counter = 0;
    $tours.empty();
    renderTours(filtered);
}

function sortDatesDESC(){
    filtered.sort(function(a,b){
        if(a.attributes.start < b.attributes.start){
            return 1;
        }
        if(a.attributes.start > b.attributes.start){
            return -1;
        }
        return 0;
    });
    page = 1;
    counter = 0;
    $tours.empty();
    renderTours(filtered);
}

function sortPriceASC(){
    filtered.sort(function(a,b){
        if(a.attributes['price-from'] > b.attributes['price-from']){
            return 1;
        }
        if(a.attributes['price-from'] < b.attributes['price-from']){
            return -1;
        }
        return 0;
    });
    page = 1;
    counter = 0;
    $tours.empty();
    renderTours(filtered);
}

function sortPriceDESC(){
    filtered.sort(function(a,b){
        if(a.attributes['price-from'] < b.attributes['price-from']){
            return 1;
        }
        if(a.attributes['price-from'] > b.attributes['price-from']){
            return -1;
        }
        return 0;
    });
    page = 1;
    counter = 0;
    $tours.empty();
    renderTours(filtered);
}

function sortSkidkiASC(){
    filtered.sort(function(a,b){
        if(a.attributes['max-discount'] > b.attributes['max-discount']){
            return 1;
        }
        if(a.attributes['max-discount'] < b.attributes['max-discount']){
            return -1;
        }
        return 0;
    });
    page = 1;
    counter = 0;
    $tours.empty();
    renderTours(filtered);
}

function sortSkidkiDESC(){
    filtered.sort(function(a,b){
        if(a.attributes['max-discount'] < b.attributes['max-discount']){
            return 1;
        }
        if(a.attributes['max-discount'] > b.attributes['max-discount']){
            return -1;
        }
        return 0;
    });
    page = 1;
    counter = 0;
    $tours.empty();
    renderTours(filtered);
}

function sortDaysASC(){
    filtered.sort(function(a,b){
        if(a.attributes.days > b.attributes.days){
            return 1;
        }
        if(a.attributes.days < b.attributes.days){
            return -1;
        }
        return 0;
    });
    page = 1;
    counter = 0;
    $tours.empty();
    renderTours(filtered);
}

function sortDaysDESC(){
    filtered.sort(function(a,b){
        if(a.attributes.days < b.attributes.days){
            return 1;
        }
        if(a.attributes.days > b.attributes.days){
            return -1;
        }
        return 0;
    });
    page = 1;
    counter = 0;
    $tours.empty();
    renderTours(filtered);
}



//if($tours.length > 0) {
    //initRiverData(filterAllData);
    getShipClasses(initRiverData);
//}


function getShipClasses(cb)
{
    //localStorage.clear();
    let url = 'https://api.mosturflot.ru/v3/rivercruises/ship-classes';
    let revision = '01';

    let isLocalStorage = 'localStorage' in window && window[ 'localStorage' ] !== null,
        request,
        apiShipClasses,
        storeIT = function()
        {
            let classes = JSON.parse(apiShipClasses).data;
            $.each(classes, function(index, item){
                shipClasses[item.id] = item.attributes.name;
                if(index + 1 === classes.length){
                    cb(filterAllData);
                }
            });
        };

    if( isLocalStorage && localStorage.getItem( 'classesETag' ) !== null )
    {
        revision = localStorage.getItem('classesETag');
        //console.log(revision);
    }

    try
    {
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader("If-None-Match", revision);
        request.onload = function () {
            console.log(request.status);
            switch (request.status) {
                case 200:
                    apiShipClasses = request.responseText;
                    storeIT();
                    if (isLocalStorage) {
                        localStorage.setItem('inlineShipClasses', apiShipClasses);
                        localStorage.setItem('classesETag', request.getResponseHeader('ETag'));
                    }
                    break;
                case 304:
                    apiShipClasses = localStorage.getItem('inlineShipClasses');
                    storeIT();
                    break;
                default:
                    if (isLocalStorage) {
                        apiShipClasses = localStorage.getItem('inlineShipClasses');
                    }
            }
        };
        request.send();
    }
    catch( e ){}
}


