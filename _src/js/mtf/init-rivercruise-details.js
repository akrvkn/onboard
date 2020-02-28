import Swiper from 'swiper';
import {cities_data, mapTree, itinerary} from "./tourpoints";
//console.log(cities_data);
'use strict';
moment.locale('ru');

let tourRoute = '', tourDates = '';

let tourNotes = '';
let rateNotes = '';
const stripTags = /(<([^>]+)>)/ig;

let shipId, tourId;

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

const mtfShipsArray = [
    {slug: 'obraztsov', id: '5'},
    {slug: 'surikov', id: '14'},
    {slug: 'krasin', id: '19'},
    {slug: 'repin', id: '36'},
    {slug: 'anastasia', id: '72'},
    {slug: 'pushkin', id: '91'},
    {slug: 'karamzin', id: '92'},
    {slug: 'krylov', id: '139'},
    {slug: 'esenin', id: '150'},
    {slug: 'bulgakov', id: '198'},
    {slug: 'rublev', id: '200'},
    {slug: 'victoria', id: '206'},
    {slug: 'grin', id: '207'},
    {slug: 'rossia', id: '247'},

];
let ship_id_from_url = 0;
//let ship_id_from_url = window.location.pathname.indexOf('/riverships/') !== -1 ? window.location.pathname.split('/')[2].replace(/\.html/g, ''): '5';
//if(window.location.pathname.indexOf('/riverships/') !== -1 && window.location.pathname.split('/')[2].length > 0) {
    let shipSlug = window.location.hostname.split('.')[0];
    $.map(mtfShipsArray, function (ship) {
        if (shipSlug === ship.slug) {
            //shipId = ship.id;
            //tourId = '5536';
        }
    });
//}
//console.log(ship_id_from_url);

//const shipId = parseUrlQuery('ship')===''?ship_id_from_url:parseUrlQuery('ship');
//const tourId = parseUrlQuery('tour')===''?'0':parseUrlQuery('tour');
shipId = '92';
tourId = '5536';

$('#booking-btn').on('click', function(e){
    console.log(tourId);
   window.location.href = 'https://booking.mosturflot.ru/rivercruises/booking/new/' + tourId;
});

const citiesURL = 'https://api.mosturflot.ru/v3/rivercruises/tour-points?filter[tour-id]=' + tourId + '&include=tour,tour.ship,excursions,title-image,tour-rates&fields[tours]=ship-id,days,start,finish,route,&fields[ships]=id,name&per-page=10000';
//https://api.mosturflot.ru/v3/rivercruises/tour-points?filter[tour-id]=5631&include=tour,tour.ship,excursions,title-image,tour-rates&fields[tours]=ship-id,days,start,finish,route,&fields[ships]=id,name&per-page=10000

const shipURL = 'https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '?include=title-image,ship-class,services,cabin-categories,staff,deckplan,on-board-name';

const shipImgURL = 'https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '/images';

const pricesURL = 'https://api.mosturflot.ru/v3/rivercruises/tours/' + tourId + '?include=tour-rates,ship-title-image,direction';

const cabinsURL = 'https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '/cabin-categories?include=title-image';

const $tourPoints = $('#river_tour_points').empty().html('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');

if(shipId > 0 ) {
    $.when($.getJSON(shipURL), $.getJSON(shipImgURL), $.getJSON(cabinsURL)).done(function (ships, images, cabins) {
        renderShipDescription(ships[0]);
        renderShipGallery(images[0]);
        renderSingleShipCabins(cabins[0]);
        if(tourId > 0 ) {
            $.when($.getJSON(citiesURL), $.getJSON(pricesURL)).done(function (points, prices) {
                tourNotes = $(prices[0].data.attributes['route-note']).text().replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "\n");
                rateNotes = $(prices[0].data.attributes['rates-note']).text().replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "\n");
                renderTourPoints(points[0]);
                //renderMapPoints(prices[0]);
                //renderCabinPrices(cabins[0], prices[0]);
                renderRouteNotes(prices[0].data.attributes['route-note']);
            });
        }
    });
}
/*if(tourId > 0 ) {
    $.when($.getJSON(citiesURL), $.getJSON(pricesURL), $.getJSON(cabinsURL)).done(function (points, prices, cabins) {
        tourNotes = $(prices[0].data.attributes['route-note']).text().replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "\n");
        rateNotes = $(prices[0].data.attributes['rates-note']).text().replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "\n");
        renderTourPoints(points[0]);
        renderCabinPrices(cabins[0], prices[0]);
        renderRouteNotes(prices[0].data.attributes['route-note']);
    });
}*/

function renderRouteNotes(notes){
    $('#route-notes').html('<h3>Примечание:</h3>' + notes);
}


function renderTariffs(tariffs){
    const $select_meals = $('#select_meal_price');
    const $select_ex = $('#select_excursions');
    const $price_table = $('#tour_price_table');
    const cartCell = '<td style="vertical-align: center;text-align: center"><a href="https://booking.mosturflot.ru/rivercruises/booking/new/'+ tourId + '" class="cart-cell"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="32" height="32"><path fill="#CCCCCC" d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"></path></svg></a></td>';

    $.map(tariffs, function(val, i){
        if(val.hasOwnProperty('name') && isNaN(val['price-adult']) === false) {
            let priceKid = '', priceVac = '', priceAdult = '', priceAdultAdd = '', priceKidAdd = '', priceAdultUpper = '', priceKidUpper = '';

            if(val['price-kid'] === 0) { val['price-kid'] = '-'; }
            if(isNaN(val['price-adult']) === false) {
                priceAdult = parseInt(val['price-adult']) - (parseInt(val['price-adult']) * parseInt(val.discount) / 100).toFixed();
                if(val['price-adult-additional']){
                    priceAdultAdd = '<br><em style="color:#7d7d7d;font-size: smaller">(доп.место ' + val['price-adult-additional'] + ')</em>';
                }
                if(val['price-adult-upper']){
                    priceAdultUpper = '<br><em style="color:#7d7d7d;font-size: smaller">(+ верхнее место ' + val['price-adult-upper'] + ')</em>';
                }
            }
            //console.log(val['price-adult-additional']);
            if(val['price-kid'] !== '-' && val['price-kid'] !== '' && val['price-kid'] !== undefined) {
                priceKid = parseInt(val['price-kid']) - (parseInt(val['price-kid']) * parseInt(val.discount) / 100).toFixed();
                if(val['price-kid-additional']){
                    priceKidAdd = '<br><em style="color:#7d7d7d;font-size: smaller">(доп.место ' + val['price-kid-additional'] + ')</em>';
                }
                if(val['price-kid-upper']){
                    priceKidUpper = '<br><em style="color:#7d7d7d;font-size: smaller">(+ верхнее место ' + val['price-kid-upper'] + ')</em>';
                }
            }
            if(val['price-vacant'] !== '-' && val['price-vacant'] !== '') {
                priceVac = parseInt(val['price-vacant']) - (parseInt(val['price-vacant']) * parseInt(val.discount) / 100).toFixed();
            }
            if(val.discount > 0 ) {
                $price_table.append('<tr><td>' + val.name + ' <br><span style="color:red">(Скидка ' + val.discount + '%) </span></td><td class="discount">' + priceAdult + ' <s>' + val['price-adult'] + '</s>' + priceAdultAdd + priceAdultUpper + '</td><td class="discount">' + priceKid + ' <s>' + val['price-kid'] + '</s>' + priceKidAdd + priceKidUpper +'</td><td class="discount">' + priceVac + ' <s>' + val['price-vacant'] + '</s></td>' + cartCell + '</tr>');
            }else{
                let kidPrice = val['price-kid'] === undefined ? '': val['price-kid'];
                $price_table.append('<tr><td>' + val.name + '</td><td>' + val['price-adult'] + priceAdultAdd + priceAdultUpper + '</td><td>' + kidPrice + priceKidAdd + priceKidUpper + '</td><td>' + val['price-vacant'] + '</td>' + cartCell + '</tr>');
            }
            //console.log(val.catid);
            //'<li class="ships__cabin">\n'
            const $cabinsHolder = $('#river_ship_cruise_cabins');
            const cabinItem = $('<li/>', {id: 'cab_' + val.catid, class: 'ships__cabin'});
            $cabinsHolder.append(cabinItem);
            renderCabins(val, 'cab_' + val.catid);
        }
    });



    const mealsData = [];
    const exData = [];
    const packs = { "b": "Только завтрак", "bd": "Завтрак и ужин", "bld": "3-разовое питание", "without": "Без питания", "ld": "Обед и ужин"};
    const expack = {"pack": "Пакет экскурсий", "without": "Без экскурсий"};
    $.map(tariffs.meals, function(meal){

        let Obj = {};
        Obj.id = meal.id;
        Obj.text = packs[meal.id];
        if(meal.id === 'bld'){
            Obj.selected = true;
        }
        mealsData.push(Obj);
    });
    //console.log(tariffs.excursions);
    $.map(tariffs.excursions, function(ex, j){
        let Obj = {};
        Obj.id = ex.id;
        Obj.text = expack[ex.id];
        if(ex.id === 'pack'){
            Obj.selected = true;
        }
        exData.push(Obj);
    });

    $select_meals.select2({
        minimumResultsForSearch: -1,
        //placeholder: 'Питание',
        dropdownParent: $select_meals.parent(),
        container: $select_meals.parent(),
        data: mealsData
    }).on('select2:select', function (e) {
        renderTariffVariant(tariffs, e.params.data.id, $select_ex.val());
    });

    //$select_meals.trigger('select2:select');

    $select_ex.select2({
        minimumResultsForSearch: -1,
        //placeholder: 'Экскурсии',
        dropdownParent: $select_ex.parent(),
        container: $select_ex.parent(),
        data: exData
    }).on('select2:select', function (e) {
        renderTariffVariant(tariffs, $select_meals.val(), e.params.data.id);
    });

    if ($select_ex.hasClass("select2-hidden-accessible") && $select_meals.hasClass("select2-hidden-accessible")) {
        // Select2 has been initialized
        //$select_meals.trigger('select2:select');
        renderTariffVariant(tariffs, $select_meals.val(),  $select_ex.val());
        //console.log($select_meals.select2('data')[0].text);
    }

    function renderTariffVariant(tariff, variant, ex){
        $price_table.html('<tr>\n' +
            '<th>Каюта</th>\n' +
            '<th>Взрослый</th>\n' +
            '<th>Детский</th>\n' +
            '<th>Доплата за свободное место</th>\n' +
            '</tr>');

        $.map(tariff, function(val, i){
            if(val.hasOwnProperty('name') && val.hasOwnProperty('meals') && val.hasOwnProperty('excursions')) {
                //console.log(val.excursions[ex].price);
                let priceAdult,
                    priceAdultAdd = '', priceKidAdd = '', priceAdultUpper = '', priceKidUpper = '',
                    priceKid = '',
                    priceVac = '',
                    adult,
                    kid = '',
                    vac = '',
                    discount,
                    varMeals = 0,
                    varEx = 0;
                if(val.excursions.hasOwnProperty(ex)) {
                    varEx = parseInt(val.excursions[ex].price);
                }
                //console.log(val.meals[variant]);
                if(val.meals.hasOwnProperty(variant)) {
                    varMeals = val.meals[variant].price;
                }
                //varEx = val.excursions[ex].price;
                adult = +val['price-adult'] + varMeals + varEx;
                if(val['price-kid'] !== '-' && val['price-kid'] !== '') {
                    kid = parseInt(val['price-kid']) + varMeals + varEx;
                }
                if(val['price-vacant'] !== '-' && val['price-vacant'] !== '') {
                    vac = parseInt(val['price-vacant']);
                }
                if(val['price-adult-additional']){
                    let paa = parseInt(val['price-adult-additional']) + varMeals + varEx;
                    priceAdultAdd = '<br><em style="color:#7d7d7d;font-size: smaller">(доп.место ' + paa + ')</em>';
                }
                if(val['price-adult-upper']){
                    let pau = parseInt(val['price-adult-upper']) + varMeals + varEx;
                    priceAdultUpper = '<br><em style="color:#7d7d7d;font-size: smaller">(+ верхнее место ' + pau + ')</em>';
                }
                if(val['price-kid-additional'] && val['price-kid-additional'] !== '-'){
                    let pka = parseInt(val['price-kid-additional']) + varMeals + varEx;
                    priceKidAdd = '<br><em style="color:#7d7d7d;font-size: smaller">(доп.место ' + pka + ')</em>';
                }
                if(val['price-kid-upper'] && val['price-kid-upper'] !== '-'){
                    let pku = parseInt(val['price-kid-upper']) + varMeals + varEx;
                    priceKidUpper = '<br><em style="color:#7d7d7d;font-size: smaller">(+ верхнее место ' + pku + ')</em>';
                }

                if(val.discount > 0) {
                    discount = parseInt(val.discount);
                    priceAdult = (adult - adult*discount/100).toFixed();
                    if(kid !== '' && kid !== '-' && kid !== undefined) {
                        priceKid = kid - (kid * discount / 100).toFixed();
                    }
                    if(vac !== '' && vac !== '-' && vac !== undefined) {
                        priceVac = (vac - vac * discount / 100).toFixed() === 0 ? '-' : (vac - vac * discount / 100).toFixed();
                    }

                    $price_table.append('<tr><td>' + val.name + '<br><span style="color:red">(Скидка ' + val.discount + '%) </span></td><td class="discount">' + priceAdult + ' <s>' + adult + '</s>' + priceAdultAdd + priceAdultUpper + '</td><td class="discount">' + priceKid + ' <s>' + kid + '</s>' + priceKidAdd + priceKidUpper + '</td><td class="discount">' + priceVac + ' <s>' + vac + '</s></td>' + cartCell + '</tr>');

                }else{
                    $price_table.append('<tr><td>' + val.name + '</td><td>' + adult + priceAdultAdd + priceAdultUpper + '</td><td>' + kid + priceKidAdd + priceKidUpper + '</td><td>' + vac + '</td>' + cartCell + '</tr>');
                }

            }
        });
    }
}

function renderShipGallery(shipimages) {
    const imggallery =  $('#shipImages');
    const imgs = {};
    $.each(shipimages.data, function(key, value){
        let caption = value.attributes.title === null ? '' : value.attributes.title;
        let str = '';
        let capHolder = '';
        if(caption.length > 0){
            capHolder = '<div class="ship-image__cabin">\n' +
                '<div class="ship-image__caption"><span>&nbsp;' + caption +'</span></div>\n' +
                '</div>';
        }
        str += '<div class="swiper-slide"><span class="ships-item__img"><picture><img src="' + value.links['image-url'] + '" height="' + value.attributes.height + '" alt="Каюта" class="ship-gallery-img"></picture>' + capHolder + '</span></div>';
        /*let str = '<li class="slider__slide swiper-slide">\n' +
            '<a href="/" class="ship-image">\n' +
            '                <div class="ship-image__bg">\n' +
            '                    <div class="ship-image__bg">\n' +
            '                        <picture>\n' +
            '                            <img src="' + value.links['image-url'] + '" alt="Теплоход" class="ship-gallery-img">\n' +
            '                        </picture>\n' +
            '                    </div>\n' +
            '                    <div class="ship-image__content">\n' +
            '                         <div class="ship-image__title">&nbsp;' + caption +'</div>\n' +
            '                    </div>' +
            '                </div>\n' +
            '</a>\n' +
            '</li>\n';*/
        imgs[value.attributes['sort-order']] = str;
        let count = 0;
        if( key + 1 === shipimages.data.length){
            $.each(imgs, function( k, v){
                count++;
                imggallery.append(v);
                //window.dispatchEvent(new Event('resize'));
                if(count === shipimages.data.length){
                    //console.log('swiper');
                    let swipe = new Swiper('.swiper-ship-gallery', {
                        autoHeight: true, //enable auto height
                        spaceBetween: 20,
                        updateOnWindowResize: true,
                        pagination: {
                            el: '.ship-pagination',
                            clickable: true,
                            dynamicBullets: true,
                            dynamicMainBullets: 1,
                        },
                        navigation: {
                            nextEl: '.ship-slider-next',
                            prevEl: '.ship-slider-prev',
                        },
                    });
                    swipe.on("init", function(){
                        window.dispatchEvent(new Event('resize'));
                        //$('.swiper-ship-gallery').css('height', '533px');
                        //swipe.slideNext();
                        //console.log('resized');
                    } );
                }
            });
        }
    });
}


function renderTourPoints(points){
    let excursions = {};
    let imgsrc = '';
    let images = {};
        $.each(points.included, function(index, inc){
            if(inc.type === 'tour-excursions'){
                excursions[inc.id] = {};
                excursions[inc.id]['name'] = 'Программа';
                excursions[inc.id]['description'] = inc.attributes.description;

                if(inc.attributes['is-additional'] === true){
                    let prices = '';
                    $.each(inc.attributes.prices, function(k, v){
                        prices += '<strong>Цена (мин. ' + v['min-group'] + ' чел.) ' + v.price + 'руб./чел.</strong><br>';
                    });
                    excursions[inc.id]['name'] = '<br><strong>\n\nДополнительные экскурсии: </strong><br>';
                    excursions[inc.id]['description'] = inc.attributes.description + prices + '<hr>';
                }
            }
            if(inc.type === 'point-images'){
                images[inc.id] = inc.links['image-url'];
            }
            if(inc.type === 'tours'){
                tourRoute = inc.attributes.route;
                tourDates = moment(inc.attributes.start).format('DD MMMM H:mm') + ' - ' + moment(inc.attributes.finish).format('DD MMMM H:mm');
                $('#tourroute').prepend(moment(inc.attributes.start).format('DD MMMM H:mm') + ' - ' + moment(inc.attributes.finish).format('DD MMMM H:mm') + ' (Дней: ' + inc.attributes.days + ')<br>' +  inc.attributes.route );
                $('#tourtitle').html('<span class="tours-item__date">' + moment(inc.attributes.start).format('DD MMMM H:mm') + ' - ' + moment(inc.attributes.finish).format('DD MMMM H:mm') + ' (Дней: ' + inc.attributes.days + ')</span><br>' +  inc.attributes.route  );
            }
            if(index + 1 === points.included.length){
                let tourpoints = {};
                    $.each(points.data, function(i, point){
                        let ex = '';
                        let def = '';
                        if(point.relationships.excursions.hasOwnProperty('data')){
                            $.each(point.relationships.excursions.data, function(a,exq){
                                if(excursions[exq.id].name === 'Программа') {
                                    def += '<p>' + excursions[exq.id].description + '</p>';
                                }else {
                                    ex += '<p><strong>' + excursions[exq.id].name + '\n\n</strong></p><p>' + excursions[exq.id].description + '</p>';
                                }
                            });
                        }
                        if(point.relationships['title-image'].hasOwnProperty('data')){
                                imgsrc = '<img src="' + images[point.relationships['title-image'].data.id] + '" alt="' + point.attributes.name + '"/>';
                        }else{
                            imgsrc = '<img src="/assets/img/mtf/ships/blank.jpg" alt="' + point.attributes.name + '"/>';
                        }

                            let arrive = moment(point.attributes.arrive).isValid() === true ? moment(point.attributes.arrive).format('DD MMMM H:mm'):'';
                            let departure = moment(point.attributes.departure).isValid() === true ? moment(point.attributes.departure).format('DD MMMM H:mm'):'';
                            let unix = moment(point.attributes.arrive).isValid() === true ? moment(point.attributes.arrive).format('X'):moment(point.attributes.date).format('X');

                            let pointDate = arrive + (departure === ''? departure: ' - ' + departure);
                            let formatDate = pointDate === '' ? moment(point.attributes.date).format('DD MMMM') : pointDate;
                            let pointTitle = point.attributes.name === null ? ' ' : point.attributes.name;
                            //console.log(point.attributes.name);
                            //if(point.attributes.name !== null) {
                                let note = '';
                                if(point.attributes.note){
                                    note = point.attributes.note;
                                }
                                if(def.length > 0){
                                    def = '<p><strong>Программа:</strong></p>' + def;
                                }

                                tourpoints[unix] = '<li class="tours__item"><div class="tours-item"><div class="tours-item__img">\n' +
                                    '<picture>' + imgsrc + '</picture></div>\n' +
                                    '<div class="tours-item__content">\n' +
                                    '<span class="tours-item__date">' + formatDate + '</span>\n' +
                                    '<span class="tours-item__title">' + pointTitle + '</span>\n' +
                                    '<div class="tours-item__text"><div class="excursions">' + note + def + ex + '</div></div></div></div></li>';
                            //}
                            if(i + 1 === points.data.length){
                                $tourPoints.empty();
                                let counter = 0;

                                $.each(tourpoints, function(key, item){
                                    counter++;
                                    $tourPoints.append(item);
                                    //console.log('title ' + $(item).find('.tours-item__title').text().replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "\n").length);

                                })
                            }
                    });
            }
        });
}

function renderShipDescription(ship) {
    const $deckplan = $('#river_ship_cruise_deckplan');
    const $riverCruiseShipDesc = $('#river_cruise_ship_desc');
    const $tourloading = $('#tourloading');
    $('#shipname').html(ship.data.attributes.name);
    $('#shiptitle').html(ship.data.attributes.name);
    $riverCruiseShipDesc.html(ship.data.attributes.description);


    let team = [];
    let servicesIncluded = [];
    let servicesPay = [];
    $.each(ship.included, function(index, included){
        if(included.type === 'deckplans' && tourId > 0){
            if(included.attributes.mime === 'image/svg+xml' ) {
                //$deckplan.html('<iframe src="https://booking.mosturflot.ru/rivercruises/' + tourId + '/deckplan" width="100%" height="' + included.attributes.height + '" style="border: 0"></iframe>' );
                $('.ships__deckplan').html('' );
                $tourloading.html('<div style="width: 100%;margin: 30px 0 0 0; text-align: center"><a href="https://booking.mosturflot.ru/rivercruises/' + tourId + '#deckplan-active" ><span style="display: block; margin: 30px;">План теплохода с реальной загрузкой кают</span><br><div style="width:350px;height:300px;margin: 0 auto;background-position: center; background-repeat: no-repeat; background-size: contain;background-image: url(/assets/img/mtf/ships/'+ shipId + '/deckplan.png)"></div></a></div>');
                //$tourloading.html('<a href="/assets/img/mtf/ships/'+ shipId + '/deckplan.webp" target="_blank"><picture><source srcset="/assets/img/mtf/ships/'+ shipId + '/deckplan.webp" type="image/webp"  width="100%"><img src="/assets/img/mtf/ships/'+ shipId + '/deckplan.jpg" alt="План палуб"  width="100%"></picture></a>');
            }else{
                $deckplan.html('<a href="' + included.links['image-url'] + '" target="_blank"><picture><img src="' + included.links['image-url'] + '" alt="План палуб" width="100%" /></picture></a>');
            }
        }else{
            //$deckplan.html('<iframe src="https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '/deckplan.svg" width="100%" height="' + included.attributes.height + '" style="border: 0"></iframe>');
            $deckplan.html('<a href="/assets/img/mtf/ships/'+ shipId + '/deckplan.webp" target="_blank"><picture><source srcset="/assets/img/mtf/ships/'+ shipId + '/deckplan.webp" type="image/webp"  width="100%"><img src="/assets/img/mtf/ships/'+ shipId + '/deckplan.png" alt="План палуб"  width="100%"></picture></a>');
        }
        if(included.type === 'staff'){
            team.push(included.attributes);
        }
        if(included.type === 'ship-classes'){
            //team.push(included.attributes);
            $riverCruiseShipDesc.prepend('Класс теплохода: ' + included.attributes.name + '<br>');
        }
        if(included.type === 'on-board-names'){
            $.getJSON('https://api.mosturflot.ru/v3/rivercruises/on-board-names/' + shipId + '/images', function (imgs) {
                //console.log(imgs.data[0].links['image-url']);
                if(imgs.data){
                    $riverCruiseShipDesc.append('<picture><img src="' + imgs.data[0].links['image-url'] + '"></picture>');
                    let ship_name = '<h3 class="section__header">Имя в истории</h3><h3>' + included.attributes.name + '</h3>' + included.attributes.description.replace(/<.*?>/g, '');
                    $riverCruiseShipDesc.append(ship_name);
                }else{
                    let ship_name = '<h3 class="section__header">Имя в истории</h3><h3>' + included.attributes.name + '</h3>' + included.attributes.description.replace(/<.*?>/g, '');
                    $riverCruiseShipDesc.append(ship_name);
                }

            });

        }
        if(included.type === 'services'){
            if(included.attributes.status === 'included' || included.attributes.status === 'some cabins' ) {
                let comment = included.attributes.status === 'some cabins' ? '<br>(Некоторые каюты)' : '';
                servicesIncluded[included.attributes['sort-order']] = '<li class="ships__item">\n' +
                    '<span class="ships-item__img">\n' +
                    '<div class="svg-' + included.id + ' svg-' + included.id + '-dims" style="margin: 0 auto;"></div>\n' +
                    //'<picture><img src="/assets/img/mtf/svg/Done-Bookmark.svg" width="40" height="40" alt=""></picture>\n' +
                    '</span>\n' +
                    '<span class="ships-item__desc">' + included.attributes.name + comment + '</span>\n' +
                    '</li>';
            }else{
                servicesPay[included.attributes['sort-order']] = '<li class="ships__item">\n' +
                    '<span class="ships-item__img">\n' +
                    '<div class="svg-' + included.id + ' svg-' + included.id + '-dims" style="margin: 0 auto;"></div>\n' +
                    //'<picture><img src="/assets/img/mtf/svg/Coins-3.svg" width="40" height="40" alt=""></picture>\n' +
                    '</span>\n' +
                    '<span class="ships-item__desc">' + included.attributes.name + '</span>\n' +
                    '</li>';

            }
        }
        if(index + 1 === ship.included.length){
            team.sort(function(a,b){
                let x=a['sort-order'],
                    y=b['sort-order'];
                return x<y ? -1 : x>y ? 1 : 0;
            });
            getStaff(team);
            //renderTeam(team);
            renderServices(servicesIncluded, servicesPay);
        }
    });

}

function renderServices(inc, pay){
    const $servicesBlockIncluded = $('#river_ship_services_included').empty();
    const $servicesBlockPay = $('#river_ship_services_pay').empty();
    $.map(inc, function (service) {
        $servicesBlockIncluded.append(service);

    });
    $.map(pay, function (money) {
        $servicesBlockPay.append(money);

    });
}

function getStaff(staff){
    //console.log(staff);
    const $personal_block = $('#river_ship_personal');
    $.map(staff, function (person, index) {
        $personal_block.append($('<li />', {id: 'staff_' + person.id, class: "ships__item"}));
        $.getJSON('https://api.mosturflot.ru/v3/rivercruises/staff/' + person.id + '/images', function (imgs) {
            let item = '';
            if(imgs.data[0].links['image-url']) {
                item = '<a href="#" class="ships-item">\n' +
                    '<span class="ships-item__img">\n' +
                    '<picture>\n' +
                    '<img src="' + imgs.data[0].links['image-url'] + '" alt="' + person.position + '">\n' +
                    '</picture>\n' +
                    '</span>\n' +
                    '<span class="tours-item__date">' + person.position + '</span>\n' +
                    '<span class="ships-item__title">' + person.name + '</span>\n' +
                    '</a>\n';
                //personal[person['sort-order']] = item;
                $('#staff_' + person.id ).append(item);
            }
        });
    });
}

function renderCabinPrices(cabins, prices){
    console.log(prices);
    //const $rivershipCabins = $('#river_ship_cruise_cabins').empty();
    let expire = '';
    if(prices.data.attributes['discount-expire']) {
        let b = moment();
        let a = moment(prices.data.attributes['discount-expire'], moment.ISO_8601);
        if(a.isAfter(b)) {
            expire += 'Действует специальное предложение на этот круиз - скидка до ' + prices.data.attributes['max-discount'] + '% (цены указаны с учётом скидки). Предложение действительно до ' + moment(prices.data.attributes['discount-expire']).format('DD MMMM YYYY') + '. Скидка не предоставляется на верхние и дополнительные места. Компания оставляет за собой право на изменение условий специального предложения в отношении отдельных рейсов и/или категорий кают.';
            //expire += 'Скидка действует до ' + moment(prices.data.attributes['discount-expire']).format('DD MMMM YYYY');

        }
    }
    $('#rate-notes').html('<span style="color:red">' + expire + '</span>' + prices.data.attributes['rates-note']);
    let pricelist = {};
    let cabinimages = {};
    let cabinsData = {};
    let shipimage = '';

    $.map(prices.included, function(included, index){
       if(included.type === 'ship-images'){
           $('#shiptitleimage').attr('src', included.links['image-url']);
           shipimage = included.links['image-url'];
       }
        if(included.type === 'tour-rates'){
            //console.log(included);
            if(pricelist.hasOwnProperty(included.attributes['category-id']) === false) {
                pricelist[included.attributes['category-id']] = {};
            }
            if(pricelist[included.attributes['category-id']].hasOwnProperty(included.attributes['rate-id']) === false) {
                pricelist[included.attributes['category-id']][included.attributes['rate-id']] = {};
            }
            let mainPrice = included.attributes['price-main'] === null ? 0 : parseInt(included.attributes['price-main']);
            let upperPrice = included.attributes['price-upper'] === null ? 0 : parseInt(included.attributes['price-upper']);
            let addPrice = included.attributes['price-additional'] === null ? 0 : parseInt(included.attributes['price-additional']);
            //console.log(addPrice);

            pricelist[included.attributes['category-id']][included.attributes['rate-id']]['price-main'] = mainPrice;
            pricelist[included.attributes['category-id']][included.attributes['rate-id']]['price-upper'] = upperPrice;
            pricelist[included.attributes['category-id']][included.attributes['rate-id']]['price-additional'] = addPrice;
            //console.log(moment().isBefore(prices.data.attributes['discount-expire']));
            if(included.attributes['discount'] > 0 && moment().isBefore(prices.data.attributes['discount-expire'])) {
                pricelist[included.attributes['category-id']]['discount'] = parseInt(included.attributes['discount']);
            }else{
                pricelist[included.attributes['category-id']]['discount'] = 0;
            }
            pricelist[included.attributes['category-id']][included.attributes['rate-id']]['meals-included'] = included.attributes['meal-pack-included'];
            pricelist[included.attributes['category-id']][included.attributes['rate-id']]['excursions-included'] = included.attributes['excursion-pack-included'];
            if(typeof included.attributes['meal-packs'] === 'object' && included.attributes['rate-id'] === 'adult') {
                pricelist['meals'] = included.attributes['meal-packs'];
                pricelist[included.attributes['category-id']]['meals'] = included.attributes['meal-packs'];
            }
            if(typeof included.attributes['excursion-packs'] === 'object' && included.attributes['rate-id'] === 'adult') {
                pricelist['excursions'] = included.attributes['excursion-packs'];
                pricelist[included.attributes['category-id']]['excursions'] = included.attributes['excursion-packs'];
            }
        }
        if(index + 1 === prices.included.length ){
            //console.log(cabins.included.length);
            let cabinsImg = cabins.hasOwnProperty('included') === true ? cabins.included : [1];
            $.map(cabinsImg, function(img, id){
                //console.log(img);
                if(img.type === 'cabin-images'){
                    cabinimages[img.id] = img.links['image-url'];
                }
                if(id + 1 === cabinsImg.length){
                    $.map(cabins.data, function(cat, i) {
                        //console.log(cat);
                        if (cabinsData.hasOwnProperty(cat.attributes['sort-order']) === false) {
                            cabinsData[cat.attributes['sort-order']] = {};
                        }
                        if (cat.relationships['title-image'].hasOwnProperty('data')) {
                            cabinsData[cat.attributes['sort-order']]['image'] = '<img src="' + cabinimages[cat.relationships['title-image'].data.id] + '" alt="' + cat.attributes.name + '" style="height: 260px;" />';
                        } else {
                            cabinsData[cat.attributes['sort-order']]['image'] = '<img src="' + shipimage + '" alt="' + cat.attributes.name + '" style="max-height: 260px;" />';
                        }
                        cabinsData[cat.attributes['sort-order']]['name'] = cat.attributes.name;
                        if (cat.attributes.description !== null){
                            cabinsData[cat.attributes['sort-order']]['description'] = cat.attributes.description.replace(/<.*?>/g, '');
                    } else{
                        cabinsData[cat.attributes['sort-order']]['description'] ='';
                    }
                        cabinsData['meals'] = pricelist['meals'];
                        cabinsData['excursions'] = pricelist['excursions'];

                        if(pricelist.hasOwnProperty(cat.id)) {
                            cabinsData[cat.attributes['sort-order']]['catid'] = cat.id;
                            cabinsData[cat.attributes['sort-order']]['meals'] = pricelist[cat.id]['meals'];
                            cabinsData[cat.attributes['sort-order']]['excursions'] = pricelist[cat.id]['excursions'];
                            cabinsData[cat.attributes['sort-order']]['discount'] = pricelist[cat.id]['discount'];
                            cabinsData[cat.attributes['sort-order']]['included'] = pricelist[cat.id]['adult'];
                            cabinsData[cat.attributes['sort-order']]['price-adult'] = pricelist[cat.id]['adult']['price-main'];
                            cabinsData[cat.attributes['sort-order']]['price-adult-additional'] = pricelist[cat.id]['adult']['price-additional'];
                            cabinsData[cat.attributes['sort-order']]['price-adult-upper'] = pricelist[cat.id]['adult']['price-upper'];
                            let kidPrice = pricelist[cat.id].hasOwnProperty('kid') === true ? pricelist[cat.id]['kid']['price-main']: '-';
                            let kidPriceUpper = pricelist[cat.id].hasOwnProperty('kid') === true ? pricelist[cat.id]['kid']['price-upper']: '-';
                            let kidPriceAdd = pricelist[cat.id].hasOwnProperty('kid') === true ? pricelist[cat.id]['kid']['price-additional']: '-';
                            let vacPrice = pricelist[cat.id].hasOwnProperty('vacant') === true ? pricelist[cat.id]['vacant']['price-main'] : '-';
                            cabinsData[cat.attributes['sort-order']]['price-kid'] = kidPrice;
                            cabinsData[cat.attributes['sort-order']]['price-kid-upper'] = kidPriceUpper;
                            cabinsData[cat.attributes['sort-order']]['price-kid-additional'] = kidPriceAdd;
                            cabinsData[cat.attributes['sort-order']]['price-vacant'] = vacPrice;
                        }else{
                            cabinsData[cat.attributes['sort-order']]['price-adult'] = '-';
                            cabinsData[cat.attributes['sort-order']]['price-kid'] = '-';
                            cabinsData[cat.attributes['sort-order']]['price-vacant'] = '-';
                        }
                        if(i + 1 === cabins.data.length){
                            //console.log('cabinsData', cabinsData);
                            renderTariffs(cabinsData);
                            //renderCabins(cabinsData);
                        }
                    });
                }
            });//cabins.included
        }
    });
}

function renderCabins(cabinCat, domID){
    const $rivershipCabins = $('#' + domID);
    //$.map(cabinsData, function(cabinCat){
        //console.log(cabinCat['price-adult']);
        if(cabinCat.hasOwnProperty('name') && cabinCat['price-adult'] !== '-' && cabinCat['price-adult'] !== undefined) {
            let catDef = cabinCat.name + "\n" + $('<p>' + cabinCat.description + '</p>').text().replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "\n") + "\n\n";

            //let rub = cabinCat['price-adult'] === '-' ? '-' : cabinCat['price-adult'] + ' руб.';
            $.getJSON('https://api.mosturflot.ru/v3/rivercruises/cabin-categories/' + cabinCat.catid + '/images', function (imgs) {
                if(imgs.data.length > 0) {
                    let swiperCabin = '<div class="swiper-container cabin' + cabinCat.catid + '" style="height:260px;"><div class="swiper-wrapper">';
                    $.map(imgs.data, function (cabimg, num) {
                        let caption = cabimg.attributes.title === null ? '' : cabimg.attributes.title;
                        let capHolder = '';
                        if(caption.length > 0){
                            capHolder = '<div class="ship-image__cabin">\n' +
                                '<div class="ship-image__caption"><span>&nbsp;' + caption +'</span></div>\n' +
                                '</div>';
                        }
                        swiperCabin += '<div class="swiper-slide" style="height:260px;"><span class="ships-item__img"><picture><img src="' + cabimg.links['image-url'] + '" alt="Каюта" style="width:100%; height: 260px;"></picture>' + capHolder + '</span></div>';
                        if(imgs.data.length === num + 1){
                            swiperCabin += '</div>' +
                                '<div class="swiper-button-next"></div>' +
                                '<div class="swiper-button-prev"></div>' +
                                '</div>';
                            $rivershipCabins.append(swiperCabin +
                                '<span class="tours-item__date" style="padding-top: 20px;">Категория: ' + cabinCat.name + '</span>\n' +
                                '<span class="ships-item__text">' + cabinCat.description + '</span>\n' +
                                '</a>\n');

                            let swipe = new Swiper('.cabin' + cabinCat.catid, {
                                autoHeight: true, //enable auto height
                                spaceBetween: 20,
                                pagination: {
                                    el: '.swiper-pagination',
                                    clickable: true,
                                },
                                navigation: {
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                },
                            });
                        }
                    });
                }else {
                    $rivershipCabins.append('<a href="https://booking.mosturflot.ru/rivercruises/booking/new/' + tourId + '" class="ships-item"><span class="ships-item__img"><picture>\n' + cabinCat.image + '</picture></span>' +
                        '<span class="tours-item__date">Категория: ' + cabinCat.name + '</span>\n' +
                        '<span class="ships-item__text">' + cabinCat.description + '</span>\n' +
                        '</a>\n');

                }
            });
        }
    //});
}

/******** Ship Default Cabins ***********/
function renderShipCabins(cabinCat, domID){
    const $rivershipCabins = $('#' + domID);
    if(cabinCat.hasOwnProperty('name') && cabinCat.description.length > 0) {
        //let rub = cabinCat['price-adult'] === '-' ? '-' : cabinCat['price-adult'] + ' руб.';
        $.getJSON('https://api.mosturflot.ru/v3/rivercruises/cabin-categories/' + cabinCat.catid + '/images', function (imgs) {
            //console.log(imgs);
            if(imgs.data.length > 0) {
                let swiperCabin = '<div class="swiper-container cabin' + cabinCat.catid + '" style="height:260px;"><div class="swiper-wrapper">';
                $.map(imgs.data, function (cabimg, num) {
                    let caption = cabimg.attributes.title === null ? '' : cabimg.attributes.title;
                    let capHolder = '';
                    if(caption.length > 0){
                        capHolder = '<div class="ship-image__cabin">\n' +
                            '<div class="ship-image__caption"><span>&nbsp;' + caption +'</span></div>\n' +
                            '</div>';
                    }
                    swiperCabin += '<div class="swiper-slide" style="height:260px;"><span class="ships-item__img"><picture><img src="' + cabimg.links['image-url'] + '" alt="Каюта" style="width:100%; height: 260px;"></picture>' + capHolder + '</span></div>';
                    if(imgs.data.length === num + 1){
                        swiperCabin += '</div>' +
                            '<div class="swiper-button-next"></div>' +
                            '<div class="swiper-button-prev"></div>' +
                            '</div>';
                        $rivershipCabins.append(swiperCabin +
                            '<span class="tours-item__date" style="padding-top: 20px;">Категория: ' + cabinCat.name + '</span>\n' +
                            '<span class="ships-item__text">' + cabinCat.description + '</span>\n' +
                            '</a>\n');

                        let swipe = new Swiper('.cabin' + cabinCat.catid, {
                            autoHeight: true, //enable auto height
                            spaceBetween: 20,
                            pagination: {
                                el: '.swiper-pagination',
                                clickable: true,
                            },
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },
                        });
                    }
                });
            }/*else {
                $rivershipCabins.append('<a href="https://booking.mosturflot.ru/rivercruises/booking/new/' + tourId + '" class="ships-item"><span class="ships-item__img"><picture><img src="/assets/img/mtf/ships/' + shipId + '/1.jpg"</picture></span>' +
                    '<span class="tours-item__date">Категория: ' + cabinCat.name + '</span>\n' +
                    '<span class="ships-item__text">' + cabinCat.description + '</span>\n' +
                    '</a>\n');

            }*/
        });
    }
    //});
}

/******** End Ship Cabins *******/

/******** river ship tours *********/
let dd = new Date();
const curr_date = dd.toISOString().substring(0, 10);
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

const $ship_cruises_block = $('#river_ship_cruises');
if($ship_cruises_block.length > 0 && ship_id_from_url > 0) {
    let ship_cruises_url = 'https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=ship-id,route,days,start,finish,price-from,is-special-offer,max-discount,price-from-discount,discount-expire&include=ship,ship-title-image&fields[ships]=name&filter[start][gte]=' + curr_date + 'T00:00:00Z&filter[ship-id]=' + ship_id_from_url + '&per-page=100';
    $.getJSON(ship_cruises_url, function (tours) {
        //$ship_cruises_block.empty();

        $.map(tours.data, function (tour) {
            let a = moment();
            let b = moment();
            if(tour.attributes['discount-expire'] !== null) {
                a = moment(tour.attributes['discount-expire'], moment.ISO_8601);
            }
            let price = '<span class="tours-item__title"><span>' + tour.attributes['price-from'] + ' руб.</span></span>';
            let skidka = '';
            if(parseInt(tour.attributes['max-discount']) > 0 && a.isAfter(b)){
                skidka = '<span class="tours-item__skidka">- ' + tour.attributes['max-discount'] + ' %</span>';
                //let oldprice = parseInt(tour.attributes['price-from']) + (parseInt(tour.attributes['price-from'])*parseInt(tour.attributes['max-discount'])/100).toFixed();
                price = '<span class="tours-item__prices"><span>' + tour.attributes['price-from'] + ' руб.</span></span>';
            }
            $ship_cruises_block.append('<li class="ships__item">\n' +
                '    <a href="/rivercruise/?ship=' + tour.attributes['ship-id'] + '&tour=' + tour.id + '" class="ships-item" target="_blank">\n' +
                '                      <span class="ships-item__img">\n' +
                '                        <picture>\n' +
                '                          <source srcset="/assets/img/mtf/ships/' + tour.attributes['ship-id'] + '.webp" type="image/webp">' +
                '                          <img src="/assets/img/mtf/ships/' + tour.attributes['ship-id'] + '.jpg" alt="">\n' +
                '                        </picture>\n' + skidka +
                '                      </span>\n' +
                '        <!-- /.tours-item__img -->\n' +
                '        <span class="tours-item__content">\n' + price +
                '                        <span class="tours-item__date" style="padding-top: 10px">' + moment(tour.attributes.start).format('DD MMMM') + ' - ' + moment(tour.attributes.finish).format('DD MMMM YYYY') + '</span>\n' +
                '            <!-- /.tours-item__date -->\n' +
                '                        <span class="tours-item__text">' + tour.attributes.route + '</span>\n' +
                '            <!-- /.tours-item__text -->\n' +
                '                      </span>\n' +
                '        <!-- /.tours-item__content -->\n' +
                '    </a>\n' +
                '    <!-- /.tours-item -->\n' +
                '</li>');

        });
        //}
    });
}
/*************** end river ship tours *******************/

/****** single ship cabins *********/
function renderSingleShipCabins(cabins){
    const $river_ship_cabins = $('#river_ship_cabins');
    if($river_ship_cabins.length > 0) {
        let ship_cabins = {};
            $.map(cabins.data, function (cabin_cat, index) {
                let desc = cabin_cat.attributes.description === null ? '' : cabin_cat.attributes.description.replace(/<.*?>/g, '');
                ship_cabins[cabin_cat.attributes['sort-order']] = {
                    catid: cabin_cat.id,
                    name: cabin_cat.attributes.name,
                    description: desc
                };

                if (cabins.data.length === index + 1) {
                    console.log(Object.keys(ship_cabins).length);
                    $.map(ship_cabins, function (item) {
                        const cabinItem = $('<li/>', {id: 'shipcab_' + item.catid, class: 'ships__cabin'});
                        $river_ship_cabins.append(cabinItem);
                        renderShipCabins(item, 'shipcab_' + item.catid);
                    });
                }
            });
    }
}

/******* Map functions *******/

const res111 = itinerary(mapTree, 'Н.Новгород', 'Кижи');
//console.log(res111);

function renderMapPoints(route){
    //console.log(route.included[0].attributes.name);
    //prices[0].data.attributes['route']

    let points = route.data.attributes['route'].split(' - ');
    let tourPoints = [];
    let cities = [];
    let coords = [];
    let dir = '';
    $.map(points, function (point, index) {
        console.log(point, index);
        if(point) {
            $.map(cities_data, function (pt) {
                if (point.indexOf(pt.name) > -1 && cities.indexOf(pt.name) === -1) {
                    tourPoints.push(pt);
                    cities.push(pt.name);
                }
                /*if(route.included[0].attributes.name.indexOf(pt.name) > -1){
                    dir = route.included[0].attributes.name;
                }*/
            });
        }
        if(points.length === index + 1) {

                renderRouteMap(tourPoints, coords);

        }
    });

}


function renderRouteMap(locations, line) {
    //console.log(line);
    let poly = [];
    let map = new google.maps.Map(document.getElementById('route-map'), {
        zoom: 5,
        scrollwheel: false,
        center: new google.maps.LatLng(55.749646, 37.62368),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        panControl: false,
        fullscreenControl: true,
        navigationControl: false,
        streetViewControl: false,
        animation: google.maps.Animation.BOUNCE,
        gestureHandling: 'cooperative',
        styles: [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#444444"
            }]
        }]
    });
    let boxText = document.createElement("div");
    boxText.className = 'map-box';
    let currentInfobox;
    let boxOptions = {
        content: boxText,
        disableAutoPan: true,
        alignBottom: true,
        maxWidth: 0,
        pixelOffset: new google.maps.Size(-145, -45),
        zIndex: null,
        boxStyle: {
            width: "260px"
        },
        closeBoxMargin: "0",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: false,
    };
    let markerCluster, marker, i;
    let allMarkers = [];
    let clusterStyles = [{
        textColor: 'white',
        url: '',
        height: 50,
        width: 50
    }];

    let bounds  = new google.maps.LatLngBounds();

    for (let c = 0; c < line.length; c++){
        let coords = new google.maps.LatLng(line[c][0], line[c][1])
        poly.push(coords);
        bounds.extend(coords);
    }

    let Itinerary = new google.maps.Polyline({
        path: poly,
        geodesic: true,
        strokeColor: '#0962a8',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });
    //Itinerary.setMap(map);

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i]['latitude'], locations[i]['longitude']),
            icon: '/assets/img/mtf/marker.png',
            id: i
        });
        allMarkers.push(marker);
        let loc = new google.maps.LatLng(locations[i]['latitude'], locations[i]['longitude']);
        bounds.extend(loc);
        //if(i === locations.length - 1){
        map.fitBounds(bounds);
        //}
        //let ib = new InfoBox();
        let infowindow = new google.maps.InfoWindow({
            content: locations[i]['name']
        });
        marker.addListener('click', function() {
            infowindow.open(map, this);
        });
        /**google.maps.event.addListener(ib, "domready", function () {
                cardRaining()
            });*/
        /*google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                ib.setOptions(boxOptions);
                boxText.innerHTML = locations[i]['name'];
                ib.close();
                ib.open(map, marker);
                currentInfobox = marker.id;
                let latLng = new google.maps.LatLng(locations[i]['latitude'], locations[i]['longitude']);
                map.panTo(latLng);
                map.panBy(0, -180);
                google.maps.event.addListener(ib, 'domready', function () {
                    $('.infoBox-close').click(function (e) {
                        e.preventDefault();
                        ib.close();
                    });
                });
            }
        })(marker, i));*/
    }
    let options = {
        imagePath: '/assets/img/mtf/',
        styles: clusterStyles,
        minClusterSize: 2
    };
    markerCluster = new MarkerClusterer(map, allMarkers, options);
    google.maps.event.addDomListener(window, "resize", function () {
        let center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });
    $('.map-item').click(function (e) {
        e.preventDefault();
        map.setZoom(15);
        let index = currentInfobox;
        let marker_index = parseInt($(this).attr('href').split('#')[1], 10);
        google.maps.event.trigger(allMarkers[marker_index], "click");
        if ($(this).hasClass("scroll-top-map")) {
            $('html, body').animate({
                scrollTop: $(".map-container").offset().top + "-80px"
            }, 500)
        } else if ($(window).width() < 1064) {
            $('html, body').animate({
                scrollTop: $(".map-container").offset().top + "-80px"
            }, 500)
        }
    });
    // Scroll enabling button
    let scrollEnabling = $('.scrollContorl');

    $(scrollEnabling).click(function (e) {
        e.preventDefault();
        $(this).toggleClass("enabledsroll");

        if ($(this).is(".enabledsroll")) {
            map.setOptions({'scrollwheel': true});
        } else {
            map.setOptions({'scrollwheel': false});
        }
    });
    let zoomControlDiv = document.createElement('div');
    let zoomControl = new ZoomControl(zoomControlDiv, map);

    function ZoomControl(controlDiv, map) {
        zoomControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(zoomControlDiv);
        controlDiv.style.padding = '5px';
        let controlWrapper = document.createElement('div');
        controlDiv.appendChild(controlWrapper);
        let zoomInButton = document.createElement('div');
        zoomInButton.className = "mapzoom-in";
        controlWrapper.appendChild(zoomInButton);
        let zoomOutButton = document.createElement('div');
        zoomOutButton.className = "mapzoom-out";
        controlWrapper.appendChild(zoomOutButton);
        google.maps.event.addDomListener(zoomInButton, 'click', function () {
            map.setZoom(map.getZoom() + 1);
        });
        google.maps.event.addDomListener(zoomOutButton, 'click', function () {
            map.setZoom(map.getZoom() - 1);
        });
    }
}