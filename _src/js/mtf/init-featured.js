import {getCookie} from "../lib/cookies";

const today = new Date();
const currentDate = today.toISOString().substring(0, 10);
const filterMtf = '&filter[ship-id][in][]=5&filter[ship-id][in][]=14&filter[ship-id][in][]=19&filter[ship-id][in][]=36&filter[ship-id][in][]=72&filter[ship-id][in][]=91&filter[ship-id][in][]=92&filter[ship-id][in][]=139&filter[ship-id][in][]=150&filter[ship-id][in][]=198&filter[ship-id][in][]=200&filter[ship-id][in][]=206&filter[ship-id][in][]=207&filter[ship-id][in][]=247';
const featuredSkidkiUrl = 'https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=ship-id,route,start,finish,days,price-from,price-from-discount,is-special-offer,start-point,finish-point,max-discount,is-online-sale,is-foreigner,is-holiday,direction-id,is-own,discount-expire&include=ship,ship-title-image,direction&fields[ships]=name,class-id&filter[start][gte]=' + currentDate + 'T00:00:00Z&filter[max-discount][gt]=0&filter[discount-expire][gte]=' + currentDate + '&per-page=8' + filterMtf;

const featuredActionsUrl = 'https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=ship-id,route,start,finish,days,price-from,price-from-discount,is-special-offer,start-point,finish-point,max-discount,is-online-sale,is-foreigner,is-holiday,direction-id,is-own&include=ship,ship-title-image,direction&fields[ships]=name,class-id&filter[start][gte]=' + currentDate + 'T00:00:00Z&filter[is-special-offer]=1&per-page=8' + filterMtf;
$.getJSON(featuredSkidkiUrl, function(data){
    let ships = {};
    let imgs = {};

    $.map(data.included, function (meta, i) {
        if (meta.hasOwnProperty('type')) {
            if (meta.type === 'ships') {
                ships[meta.id] = meta.attributes.name;
            }
            if (meta.type === 'ship-images') {
                imgs[meta.attributes['ship-id']] = meta.links['image-url'];
            }
        }
        if (data.included.length === i + 1) {

            let $skidki = $('#featured-skidki').empty();
            $.map(data.data, function (tour, ix) {
                let newPrice = parseInt(tour.attributes['price-from']);
                let skidka = '<span class="tours-item__skidka">- ' + tour.attributes['max-discount'] + ' %</span>';
                let price = '<span class="specials-item__prices"><span>' + tour.attributes['price-from'] + ' руб.</span></span>';

                $skidki.append('<li class="slider-list__item swiper-slide"><a href="/rivercruise?ship=' + tour.attributes['ship-id'] + '&tour=' + tour.id + '" class="specials-item"><span class="specials-item__img">\n' +
                    '<picture><img src="' + imgs[tour.attributes['ship-id']] + '" alt="теплоход"></picture>' + skidka + '</span>\n' +
                    '<span class="specials-item__date">' + moment(tour.attributes.start).format('DD MMMM') + '-' + moment(tour.attributes.finish).format('DD MMMM YYYY') + '</span>\n' +
                    '<span class="specials-item__title">' + ships[tour.attributes['ship-id']] + '</span>\n' +
                    '<span class="specials-item__text">' + tour.attributes.route + '</span>\n' + price +
                    '</a></li>');
                if(data.data.length === ix +1){
                    window.dispatchEvent(new Event('resize'));
                }
            });
        }
    });
});

$('#filter-1-panel button').on('click', function(e){
    e.preventDefault();
    let dirSelected = $('#filter-1-panel select[name="direction"]').val();
    let shipSelected = $('#filter-1-panel select[name="ship"]').val();
    let dateOut = $('#filter-1-panel input[name="date_out"]').val().substr(0, 10);
    let dateIn = $('#filter-1-panel input[name="date_in"]').val().substr(0, 10);
    window.location.href = '/rivercruises?direction=' + dirSelected + '&ship=' + shipSelected + '&dateFrom=' + dateOut + '&dateTo=' + dateIn;
});

const user = getCookie('mtf-user');
console.log(user);