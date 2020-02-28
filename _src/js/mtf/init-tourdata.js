'use strict';

//import moment from "moment";
moment.locale('ru');

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

const shipId = parseUrlQuery('ship')===''?'206':parseUrlQuery('ship');
const tourId = parseUrlQuery('tour')===''?'4979':parseUrlQuery('tour');

const pointsURL = 'https://api.mosturflot.ru/v3/rivercruises/tour-points?filter[tour-id]=' + tourId + '&include=tour,tour.ship,excursions&fields[tour-points]=tour-id,date,arrive,departure,point-id,name&fields[tours]=ship-id,start,finish,route&fields[ships]=id,name';

//https://api.mosturflot.ru/v3/rivercruises/tour-points?filter[tour-id]=4878&include=tour,tour.ship,excursions,tour-rates&fields[tour-points]=tour-id,date,arrive,departure,point-id,name,title-image&fields[tours]=ship-id,start,finish,route&fields[ships]=id,name

const $tourPoints = $('#river_tour_points');

if($tourPoints.length > 0 && shipId.length > 0 && tourId.length > 0){
    let excursions = {};
    let imgsrc = '';
    let shiptitleimgurl = '';
    $.getJSON(pointsURL, function (points) {
        $.each(points.included, function(index, inc){
            if(inc.type === 'tour-excursions'){
                excursions[inc.id] = {};
                excursions[inc.id]['name'] = inc.attributes.name;
                excursions[inc.id]['description'] = inc.attributes.description;
            }
            if(inc.type === 'ships'){
                $('.hero-inner-item__title').html(inc.attributes.name);
                shiptitleimgurl = inc.relationships.images.links.related;
                $('#shiptitleimage').attr('src', inc.relationships.images.links.related);
            }
            if(inc.type === 'tours'){
                $('.hero-inner-item__link').prepend(moment(inc.attributes.start).format('DD MMMM H:mm') + ' - ' + moment(inc.attributes.finish).format('DD MMMM H:mm') + '<br>' +  inc.attributes.route );
            }
            if(index + 1 === points.included.length){
                let tourpoints = {};
                $.getJSON(shiptitleimgurl, function(shipimg){
                    if(shipimg.data.length > 0){
                        imgsrc = shipimg.data[0].links['image-url'];
                        //$('.ship-image__bg picture source').hide();
                        $('.ship-image__bg picture img').attr('src', imgsrc);
                    }else{
                        $('.ship-image__bg picture img').hide();
                    }
                    $.each(points.data, function(i, point){
                        let imgURL = point.relationships.images.links.related;

                        let ex = '';
                        if(point.relationships.excursions.hasOwnProperty('data')){
                            $.each(point.relationships.excursions.data, function(a,exq){
                                ex += '<p>' + excursions[exq.id].name + '</p><p>' + excursions[exq.id].description + '</p>';
                            });
                        }
                        $.getJSON(imgURL, function(img){
                            if(img.data.length > 0){
                                imgsrc = img.data[0].links['image-url'];
                            }else{
                                imgsrc = $('.ship-image__bg picture img').attr('src');
                            }
                            let arrive = moment(point.attributes.arrive).isValid() === true ? moment(point.attributes.arrive).format('DD MMMM H:mm'):'';
                            let departure = moment(point.attributes.departure).isValid() === true ? moment(point.attributes.departure).format('DD MMMM H:mm'):'';
                            let unix = moment(point.attributes.arrive).isValid() === true ? moment(point.attributes.arrive).format('X'):moment(point.attributes.date).format('X');

                            let pointDate = arrive + (departure === ''? departure: ' - ' + departure);
                            let formatDate = pointDate === '' ? moment(point.attributes.date).format('DD MMMM') : pointDate;



                            tourpoints[unix] = '<li class="tours__item"><div class="tours-item"><div class="tours-item__img">\n' +
                                '<picture><img src="' + imgsrc + '" alt="стоянка"></picture></div>\n' +
                                '<div class="tours-item__content">\n' +
                                '<span class="tours-item__date">' + formatDate + '</span>\n' +
                                '<span class="tours-item__title">' + point.attributes.name + '</span>\n' +
                                '<div class="tours-item__text"><div class="excursions">' + ex + '</div></div></div></div></li>';
                            if(i + 1 === points.data.length){
                                $.each(tourpoints, function(key, item){
                                    $tourPoints.append(item);
                                })
                            }
                        });
                    });
                });
            }
        });
    });
}

/***** deckplan *****/
const $deckplan = $('#river_ship_cruise_deckplan');
if($deckplan.length > 0) {
    $.getJSON('https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '/deckplan', function (deck) {
        if(deck.data.attributes.mime === 'image/svg+xml') {
            $deckplan.html('<iframe src="https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '/deckplan.svg" width="100%" height="1000" frameborder="0"></iframe>' );
        }else{
            $deckplan.html('<img src="' + deck.data.links['image-url'] + '" alt="План палуб" width="100%" />');
        }
    });

}

/*** end deckplan ******/

/****** personal *******/

const $personal_block = $('#river_cruise_ship_personal');
let getStaff = (ship) => {
    $.getJSON('https://api.mosturflot.ru/v3/rivercruises/ships/' + ship + '/staff', function (staff) {
        //console.log(ship_id_from_url);
        //console.log(staff);
        $personal_block.empty();
        let personal_items = {};
        $.map(staff.data, function (person, index) {
            $.getJSON('https://api.mosturflot.ru/v3/rivercruises/staff/' + person.id + '/images', function (imgs) {
                let photoTeam = '';
                if(imgs.data.length > 0) {
                    photoTeam = '<span class="ships-item__img">\n' +
                        '<picture>\n' +
                        '<img src="' + imgs.data[0].links['image-url'] + '" alt="' + person.attributes.position + '">\n' +
                        '</picture>\n' +
                        '</span>\n';
                }
                //console.log(person.attributes['sort-order'] + '---' + person.attributes.name);
                personal_items[100 + parseInt(person.attributes['sort-order'])] = '<li class="ships__item">\n' +
                    '<a href="#" class="ships-item">\n' + photoTeam +
                    '<span class="tours-item__date">' + person.attributes.position + '</span>\n' +
                    '<span class="ships-item__title">' + person.attributes.name + '</span>\n' +
                    '</a>\n' +
                    '</li>';
                if (staff.data.length === index + 1) {
                    $.map(personal_items, function (item) {

                        $personal_block.append(item);

                    });
                }

            });
        });
    });
}
if($personal_block.length > 0) {
    getStaff(shipId);
}

/********* end personal *********/

/****** services *******/

const $services_block_included = $('#river_ship_services_included');
const $services_block_pay = $('#river_ship_services_pay');
if($services_block_included.length > 0) {
    $.getJSON('https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '/services', function (services) {
        $services_block_included.empty();
        $services_block_pay.empty();
        $.map(services.data, function (service) {
            if(service.attributes.status === "included") {
                $services_block_included.append( '<li class="ships__item">\n' +
                    //'<a href="#" class="ships-item">\n' +
                    '<span class="ships-item__img">\n' +
                    '<picture>\n' +
                    '<img src="/assets/img/mtf/svg/Done-Bookmark.svg" width="40" height="40" alt="">\n' +
                    '</picture>\n' +
                    '</span>\n' +
                    '<!-- /.ships-item__img -->\n' +
                    '<span class="ships-item__desc">' + service.attributes.name + '</span>\n' +
                    '<!-- /.ships-item-title -->\n' +
                    //'</a>\n' +
                    '<!-- /.ships-item -->\n' +
                    '</li>');
            }else{
                $services_block_pay.append( '<li class="ships__item">\n' +
                    //'<a href="#" class="ships-item">\n' +
                    '<span class="ships-item__img">\n' +
                    '<picture>\n' +
                    '<img src="/assets/img/mtf/svg/Coins-3.svg" width="40" height="40" alt="">\n' +
                    '</picture>\n' +
                    '</span>\n' +
                    '<!-- /.ships-item__img -->\n' +
                    '<span class="ships-item__desc">' + service.attributes.name + '</span>\n' +
                    '<!-- /.ships-item-title -->\n' +
                    //'</a>\n' +
                    '<!-- /.ships-item -->\n' +
                    '</li>');
            }
        });

    });
}

/********* end services *********/

/*** cruise ship description *****/

const $river_ship_desc = $('#river_cruise_ship_desc');

if($river_ship_desc.length > 0 ) {
    const single_ship_url = 'https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId;

    $.getJSON(single_ship_url, function (ship) {
        $river_ship_desc.empty();
        $river_ship_desc.append(ship.data.attributes.description);//.replace(/<.*?>/g, '')
        getShipNameDescription(ship.data.relationships['on-board-name'].links.related);
    });
}

function getShipNameDescription(ship_name_url){
    $.getJSON(ship_name_url, function (res) {
        //console.log(res);
        if(res.data !== null) {
            let ship_name = '<h3 class="section__header section_padding_top">Имя в истории</h3>';
            ship_name += '<h3>' + res.data.attributes.name + '</h3>' + res.data.attributes.description.replace(/<.*?>/g, '');
            $river_ship_desc.append(ship_name);
        }
    }).fail(function(){
        console.log(shipid + ' name failed');
    });

}

/******* end cruise ship description *****/


/***** cabins *****/

const $rivershipCabins = $('#river_ship_cruise_cabins');

let cabinCategories = (ship, tour) => {
    const rivershipCabinsUrl = 'https://api.mosturflot.ru/v3/rivercruises/ships/' + ship + '/cabin-categories?include=title-image';
    const cruisePricesUrl = 'https://api.mosturflot.ru/v3/rivercruises/tours/' + tour + '/tour-rates';
    //$rivershipCabins.empty();

    $.when($.getJSON(rivershipCabinsUrl), $.getJSON(cruisePricesUrl)).then(function(cabins, prices){
        let formattedCabins = parseCabins(cabins, prices);
        $.map(formattedCabins, function(cab){
            $rivershipCabins.append(cab);
        });
    });
};

let  parseCabins = (cabins, prices) => {
    let pricesObj = {};
    let cabinsImages = {};
    let shipCabins = {};
    $.map(cabins.included, function(cabinImage){
        cabinsImages[cabinImage.id] = cabinImage.links['image-url'];
    });
    $.map(prices.data, function (price) {
        //console.log(price);

        if(price.attributes['discount'] > 0){
            let newPrice = parseInt(price.attributes['price-main']);
            let oldPrice = newPrice + newPrice*parseInt(price.attributes['discount'])/100;
            pricesObj[price.attributes['category-id']] = '<span class="tours-item__prices"><span>' + price.attributes['price-main'] + ' руб.</span><s>' + oldPrice + '</s></span>';
        }else{
            pricesObj[price.attributes['category-id']] = '<span class="tours-item__date"><span>' + price.attributes['price-main'] + ' руб.</span></s></span>';
        }
        //pricesObj[price.attributes['category-id']] = '<span class="tours-item__date"><span>' + price.attributes['price-main'] + ' руб.</span></span>';
    });

    $.map(cabins.data, function (cabinCat, index) {
        let cabinPrice = pricesObj[cabinCat.id] === undefined ? '': pricesObj[cabinCat.id];


        let cabinImg = cabinsImages[cabinCat.relationships['title-image'].data.id] === undefined ? '' : '<span class="ships-item__img"><picture><img src="' + cabinsImages[cabinCat.relationships['title-image'].data.id] + '" alt="Каюта категории ' + cabinCat.attributes.name + '" style="width:100%; max-height: 260px;"></picture></span>';
        shipCabins[ cabinCat.attributes['sort-order']] = '<li class="ships__cabin">\n' +
            '<a href="https://booking.mosturflot.ru/rivercruises/booking/new/' + tourId +'" class="ships-item">\n' + cabinImg + cabinPrice +
            '<span class="ships-item__title">Категория: ' + cabinCat.attributes.name + '</span>\n' +
            '<span class="ships-item__text">' + cabinCat.attributes.description.replace(/<.*?>/g, '') + '</span>\n' +
            '</a>\n' +
            '</li>';
    });

    return shipCabins;
};


if($rivershipCabins.length > 0) {
    //ship_id_from_url = window.location.pathname.split('/')[2].replace(/\.html/g, '');
    const rivershipCabinsUrl = 'https://api.mosturflot.ru/v3/rivercruises/ships/' + shipId + '/cabin-categories';
    const cruisePricesUrl = 'https://api.mosturflot.ru/v3/rivercruises/tours/' + tourId + '/tour-rates';
    $rivershipCabins.empty();
    let shipCabins = {};

    $.when($.getJSON(rivershipCabinsUrl), $.getJSON(cruisePricesUrl)).done(function(cabins, prices){

            let pricesObj = {};
            $.map(prices[0].data, function (price) {
                let priceList = '';
                if(price.attributes['discount'] > 0){
                    let newPrice = parseInt(price.attributes['price-main']);
                    let oldPrice = newPrice + newPrice*parseInt(price.attributes['discount'])/100;
                    priceList = '<span class="tours-item__prices"><span>' + price.attributes['price-main'] + ' руб.</span><s>' + oldPrice + '</s></span>';
                }else{
                    priceList = '<span class="tours-item__date"><span>' + price.attributes['price-main'] + ' руб.</span></s></span>';
                }
                pricesObj[price.attributes['category-id']] = '<span class="tours-item__date"><span>' + price.attributes['price-main'] + ' руб.</span></span>';
            });

            $.map(cabins[0].data, function (cabinCat, index) {
                console.log(cabinCat);
                let cabinPrice = pricesObj[cabinCat.id] === undefined ? '': pricesObj[cabinCat.id];
                $.getJSON('https://api.mosturflot.ru/v3/rivercruises/cabin-categories/' + cabinCat.id + '/images', function (images) {

                    let cabinImg = images.data.length > 0 ? '<span class="ships-item__img"><picture><img src="' + images.data[0].links['image-url'] + '" alt="Каюта категории ' + cabinCat.attributes.name + '" style="width:100%; max-height: 260px;"></picture></span>' : '';
                        //console.log(cabin_cat.attributes['sort-order']);
                        shipCabins[ cabinCat.attributes['sort-order']] = '<li class="ships__cabin">\n' +
                            '<a href="https://booking.mosturflot.ru/rivercruises/booking/new/' + tourId +'" class="ships-item">\n' + cabinImg + cabinPrice +
                            '<span class="ships-item__title">Категория: ' + cabinCat.attributes.name + '</span>\n' +
                            '<span class="ships-item__text">' + cabinCat.attributes.description.replace(/<.*?>/g, '') + '</span>\n' +
                            '</a>\n' +
                            '</li>';
                    if(cabins[0].data.length === index + 1){
                        console.log(Object.keys(shipCabins).length);
                        $.map(shipCabins, function(cat){
                            $rivershipCabins.append(cat);
                        })
                    }

                });

            });
        });

   //cabinCategories(shipId, tourId);

}



/**** end cabins *******/
