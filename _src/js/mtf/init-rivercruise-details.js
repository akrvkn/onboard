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

//const citiesURL = 'https://api.mosturflot.ru/v3/rivercruises/tour-points?filter[tour-id]=' + tourId + '&include=tour,tour.ship,excursions,title-image,tour-rates&fields[tours]=ship-id,days,start,finish,route,&fields[ships]=id,name&per-page=10000';

const citiesURL = 'assets/data/ships/' + shipId + '/' + tourId + '.json';

//const shipURL = 'https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '?include=title-image,ship-class,services,cabin-categories,staff,deckplan,on-board-name';

const shipURL = 'assets/data/ships/' + shipId + '/ship.json';

//const shipImgURL = 'https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '/images';

const shipImgURL = 'assets/data/ships/' + shipId + '/images.json';

const staffURL = 'assets/data/ships/' + shipId + '/staff.json';

const shipToursURL = 'assets/data/ships/' + shipId + '/tours.json';

//const pricesURL = 'https://api.mosturflot.ru/v3/rivercruises/tours/' + tourId + '?include=tour-rates,ship-title-image,direction';

//const cabinsURL = 'https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '/cabin-categories?include=title-image';

const $tourPoints = $('#river_tour_points').empty().html('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');

if(shipId > 0 && tourId > 0) {
    $.when($.getJSON(shipURL), $.getJSON(shipImgURL), $.getJSON(citiesURL), $.getJSON(staffURL), $.getJSON(shipToursURL)).done(function (ships, images, points, staff, tours) {
        renderShipDescription(ships[0]);
        renderShipGallery(images[0]);
        renderTourPoints(points[0]);
        renderStaff(staff[0]);
        renderShipTours(tours[0]);
    });
}

function renderRouteNotes(notes){
    $('#route-notes').html('<h3>Примечание:</h3>' + notes);
}

function basename( path )
{
    let parts = path.split( '/' );
    return parts[parts.length-1];
}


function renderShipGallery(shipimages) {
    const imggallery =  $('#shipImages');
    const imgs = {};
    $.each(shipimages.data, function(key, value){
        //console.log(basename(value.links['image-url']));
        let caption = value.attributes.title === null ? '' : value.attributes.title;
        let str = '';
        let capHolder = '';
        if(caption.length > 0){
            capHolder = '<div class="ship-image__cabin">\n' +
                '<div class="ship-image__caption"><span>&nbsp;' + caption +'</span></div>\n' +
                '</div>';
        }
        str += '<div class="swiper-slide"><span class="ships-item__img"><picture><img src="assets/data/ships/' + shipId + '/images/' + basename(value.links['image-url']) + '" height="' + value.attributes.height + '" alt="Каюта" class="ship-gallery-img"></picture>' + capHolder + '</span></div>';
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
                            if(i + 1 === points.data.length){
                                $tourPoints.empty();
                                let counter = 0;

                                $.each(tourpoints, function(key, item){
                                    counter++;
                                    $tourPoints.append(item);
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
        if(included.type === 'ship-classes'){
            $riverCruiseShipDesc.prepend('Класс теплохода: ' + included.attributes.name + '<br>');
        }
        if(included.type === 'on-board-names'){
            $.getJSON('https://api.mosturflot.ru/v3/rivercruises/on-board-names/' + shipId + '/images', function (imgs) {
                if(imgs.data){
                    $riverCruiseShipDesc.append('<picture><img src="' + imgs.data[0].links['image-url'] + '"></picture>');
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

function renderStaff(staff){
    //console.log(staff);
    const $personal_block = $('#river_ship_personal');
    $.map(staff, function (person, index) {
        $personal_block.append($('<li />', {id: 'staff_' + person.id, class: "ships__item"}));

             let item = '<a href="#" class="ships-item">\n' +
                    '<span class="ships-item__img">\n' +
                    '<picture>\n' +
                    '<img src="assets/data/ships/' + shipId + '/staff/' + person.image + '" alt="' + person.position + '">\n' +
                    '</picture>\n' +
                    '</span>\n' +
                    '<span class="tours-item__date">' + person.position + '</span>\n' +
                    '<span class="ships-item__title">' + person.name + '</span>\n' +
                    '</a>\n';
                $('#staff_' + person.id ).append(item);
        });
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
            }
        });
    }
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

function renderShipTours(tours) {
    const $ship_cruises_block = $('#river_ship_cruises');
    if ($ship_cruises_block.length > 0 && shipId > 0) {
        /*let ship_cruises_url = 'https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=ship-id,route,days,start,finish,price-from,is-special-offer,max-discount,price-from-discount,discount-expire&include=ship,ship-title-image&fields[ships]=name&filter[start][gte]=' + curr_date + 'T00:00:00Z&filter[ship-id]=' + ship_id_from_url + '&per-page=100';*/
        //$.getJSON(ship_cruises_url, function (tours) {

            $.map(tours.data, function (tour) {
                let a = moment();
                let b = moment();
                if (tour.attributes['discount-expire'] !== null) {
                    a = moment(tour.attributes['discount-expire'], moment.ISO_8601);
                }
                let price = '<span class="tours-item__title"><span>' + tour.attributes['price-from'] + ' руб.</span></span>';
                let skidka = '';
                if (parseInt(tour.attributes['max-discount']) > 0 && a.isAfter(b)) {
                    skidka = '<span class="tours-item__skidka">- ' + tour.attributes['max-discount'] + ' %</span>';
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
                    '        <span class="tours-item__content">\n' + price +
                    '                        <span class="tours-item__date" style="padding-top: 10px">' + moment(tour.attributes.start).format('DD MMMM') + ' - ' + moment(tour.attributes.finish).format('DD MMMM YYYY') + '</span>\n' +
                    '                        <span class="tours-item__text">' + tour.attributes.route + '</span>\n' +
                    '                      </span>\n' +
                    '    </a>\n' +
                    '</li>');
            });
        //});
    }
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