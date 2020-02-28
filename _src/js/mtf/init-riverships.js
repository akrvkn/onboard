'use strict';

//import moment from "moment";
moment.locale('ru');

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
console.log(window.location.pathname.split('/')[2]);
//let ship_id_from_url = window.location.pathname.indexOf('/riverships/') !== -1 ? window.location.pathname.split('/')[2].replace(/\.html/g, ''): '5';
if(window.location.pathname.indexOf('/riverships/') !== -1 && window.location.pathname.split('/')[2].length > 0) {
    let shipSlug = window.location.pathname.split('/')[2];
    $.map(mtfShipsArray, function (ship) {
        if (shipSlug === ship.slug) {
            ship_id_from_url = ship.id;
        }
    });
}

console.log(ship_id_from_url);
/************ river ship tours ************/
//https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=ship-id,route,days,start,end,price-from,is-special-offer&include=ship,ship-title-image&fields[ships]=name&filter[start][gte]=2019-03-09T00:00:00Z&filter[ship-id]=5&per-page=100

let dd = new Date();
const curr_date = dd.toISOString().substring(0, 10);

const $ship_cruises_block = $('#river_ship_cruises').empty();
if($ship_cruises_block.length > 0 && ship_id_from_url > 0) {
    let ship_cruises_url = 'https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=ship-id,route,days,start,finish,price-from,is-special-offer,max-discount,price-from-discount&include=ship,ship-title-image&fields[ships]=name&filter[start][gte]=' + curr_date + 'T00:00:00Z&filter[ship-id]=' + ship_id_from_url + '&per-page=100';
    $.getJSON(ship_cruises_url, function (tours) {
        //$ship_cruises_block.empty();

            $.map(tours.data, function (tour) {
                let price = '<span class="tours-item__title"><span>' + tour.attributes['price-from'] + ' руб.</span></span>';
                if(parseInt(tour.attributes['max-discount']) > 0 ){
                    let oldprice = parseInt(tour.attributes['price-from']) + parseInt(tour.attributes['price-from'])*parseInt(tour.attributes['max-discount'])/100;
                    price = '<span class="tours-item__prices"><span>' + tour.attributes['price-from'] + ' руб.</span><s>' + oldprice + '</s></span>';
                }
                $ship_cruises_block.append('<li class="ships__item">\n' +
                    '    <a href="/rivercruise/?ship=' + tour.attributes['ship-id'] + '&tour=' + tour.id + '" class="ships-item">\n' +
                    '                      <span class="ships-item__img">\n' +
                    '                        <picture>\n' +
                    '                          <source srcset="/assets/img/mtf/ships/' + tour.attributes['ship-id'] + '.webp" type="image/webp">' +
                    '                          <img src="/assets/img/mtf/ships/' + tour.attributes['ship-id'] + '.jpg" alt="">\n' +
                    '                        </picture>\n' +
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






const $river_ship_cabins = $('#river_ship_cabins');

if($river_ship_cabins.length > 0) {
    //ship_id_from_url = window.location.pathname.split('/')[2].replace(/\.html/g, '');
    const river_ship_cabins_url = 'https://api.mosturflot.ru/v3/rivercruises/ships/' + ship_id_from_url + '/cabin-categories';
    $river_ship_cabins.empty();
    let ship_cabins = {};
    $.getJSON(river_ship_cabins_url, function (cabins) {
        //console.log(json);
        $.map(cabins.data, function (cabin_cat, index) {
            $.getJSON('https://api.mosturflot.ru/v3/rivercruises/cabin-categories/' + cabin_cat.id + '/images', function (images) {
                if(images.data.length > 0 ) {
                    //console.log(cabin_cat.attributes['sort-order']);
                    ship_cabins[100 + parseInt(cabin_cat.attributes['sort-order'])] ='<li class="ships__cabin">\n' +
                        '<a href="#" class="ships-item">\n' +
                        '<span class="ships-item__img">\n' +
                        '<picture>\n' +
                        '<img src="' + images.data[0].links['image-url'] + '" style="height: 260px;" alt="">\n' +
                        '</picture>\n' +
                        '</span>\n' +
                        '<!-- /.ships-item__img -->\n' +
                        '<span class="ships-item__title">' + cabin_cat.attributes.name + '</span>\n' +
                        '<!-- /.ships-item-title -->\n' +
                        '<span class="ships-item__text">' + cabin_cat.attributes.description.replace(/<.*?>/g, '') + '</span>\n' +
                        '<!-- /.ships-item__text -->\n' +
                        '</a>\n' +
                        '<!-- /.ships-item -->\n' +
                        '</li>';
                }else{
                    //console.log(cabin_cat.attributes['sort-order']);
                    if(cabin_cat.attributes.description !== null && cabin_cat.attributes.name !== null) {
                        ship_cabins[100 + parseInt(cabin_cat.attributes['sort-order'])] = '<li class="ships__cabin">\n' +
                            '<a href="#" class="ships-item">\n' +
                            '<span class="ships-item__img">\n' +
                            '<picture>\n' +
                            '<img src="/assets/img/mtf/cabin_default.jpg" alt="">\n' +
                            '</picture>\n' +
                            '</span>\n' +
                            '<!-- /.ships-item__img -->\n' +
                            '<span class="ships-item__title">' + cabin_cat.attributes.name + '</span>\n' +
                            '<!-- /.ships-item-title -->\n' +
                            '<span class="ships-item__text">' + cabin_cat.attributes.description.replace(/<.*?>/g, '') + '</span>\n' +
                            '<!-- /.ships-item__text -->\n' +
                            '</a>\n' +
                            '<!-- /.ships-item -->\n' +
                            '</li>';
                    }
                }
                //console.log(Object.keys(ship_cabins).length);
                if(cabins.data.length  === index + 1){
                            $.map(ship_cabins, function(item){
                                $river_ship_cabins.append(item);
                            });
                        }
            }).fail(function(){
                console.log('404:https://api.mosturflot.ru/v3/rivercruises/cabin-categories/' + cabin_cat.id + '/images');
            });

        });

    });
}

/****** personal *******/

const $personal_block = $('#river_ship_personal');
if($personal_block.length > 0) {
    $.getJSON('https://api.mosturflot.ru/v3/rivercruises/ships/' + ship_id_from_url + '/staff', function (staff) {
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

/********* end personal *********/

//}() );
