//;(function () {
    "use strict";
    var markerIcon = {
        anchor: new google.maps.Point(22, 16),
        url: '/assets/img/mtf/ship.png',
    };

    /***current cruises data ******/

    var cities_data = [
        {name: "Тверь", latitude: 56.7830290, longitude: 35.72360530},
        {name: "Ахтуба", latitude: 48.2746, longitude: 46.193},
        {name: "Великий Новгород", latitude: 58.536742, longitude: 31.271227},
        {name: "Валаам", latitude: 61.366667, longitude: 30.933333},
        {name: "Старая Ладога", latitude: 59.995076, longitude: 32.294347},
        {name: "Москва", latitude: 55.749646, longitude: 37.62368},
        {name: "Мышкин", latitude: 57.784019, longitude: 38.45456},
        {name: "Рыбинск", latitude: 58.043047, longitude: 38.85719},
        {name: "Ярославль", latitude: 57.633568, longitude: 39.879512},
        {name: "Кострома", latitude: 57.771284, longitude: 40.950603},
        {name: "Череповец", latitude: 59.129209, longitude: 37.907906},
        {name: "Горицы", latitude: 59.869734, longitude: 38.260342},
        {name: "Кижи", latitude: 62.066667, longitude: 35.238056},
        {name: "Соловецкие острова", latitude: 65.1, longitude: 35.683333},
        {name: "Петрозаводск", latitude: 61.788863, longitude: 34.359724},
        {name: "Мандроги", latitude: 60.92555849999999, longitude: 33.59189140},
        {name: "Н.Новгород", latitude: 56.29274, longitude: 43.926745},
        {name: "Казань", latitude: 55.824874, longitude: 49.086087},
        {name: "Самара", latitude: 53.260908, longitude: 50.198077},
        {name: "Саратов", latitude: 51.534272, longitude: 46.01014},
        {name: "Волгоград", latitude: 48.711923, longitude: 44.491084},
        {name: "Астрахань", latitude: 46.333818, longitude: 48.021857},
        {name: "Ростов-на-Дону", latitude: 47.261008, longitude: 39.628},
        {name: "Пермь", latitude: 58.001985, longitude: 56.257287},
        {name: "Санкт-Петербург", latitude: 59.90802, longitude: 30.409998},
        {name: "Углич", latitude: 57.52234, longitude: 38.30391},
        {name: "Плёс", latitude: 57.453764, longitude: 41.507726},
        {name: "Лодейное поле", latitude: 60.734267, longitude: 33.555964},
        {name: "Вытегра", latitude: 61.010869, longitude: 36.434714},
        {name: "Чебоксары", latitude: 56.104219, longitude: 47.259418},
        {name: "Козьмодемьянск", latitude: 56.332705, longitude: 46.547541},
        {name: "Уфа", latitude: 54.809866, longitude: 56.093911},
        {name: "Повенец", latitude: 62.848879, longitude: 34.829407},
        {name: "Тольятти", latitude: 53.521911, longitude: 49.435092},
        {name: "Коломна", latitude: 55.095240, longitude: 38.765224},
        {name: "Константиново", latitude: 55.487887, longitude: 37.982154},
        {name: "Рязань", latitude: 54.629148, longitude: 39.734928},
        {name: "Болгары", latitude: 54.996159, longitude: 49.016942}
    ];

    function locationData(locationURL, locationCategory, locationImg, locationTitle, locationAddress, locationPhone, locationStarRating, locationRevievsCounter) {
        return ('<div class="map-popup-wrap"><div class="map-popup"><div class="infoBox-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" width="30" height="30"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></div><div class="map-popup-category">' + locationCategory + '</div><a href="' + locationURL + '" class="listing-img-content fl-wrap"><img src="' + locationImg + '" alt=""></a> <div class="listing-content fl-wrap"><div class="card-popup-raining map-card-rainting"><span class="map-popup-reviews-count">Ближайшая остановка ( ' + locationRevievsCounter + ' )</span></div><div class="listing-title fl-wrap"><h4><a href=' + locationURL + '>' + locationTitle + '</a></h4><span class="map-popup-location-info"><i class="fa fa-map-marker"></i>' + locationAddress + '</span><span class="map-popup-location-phone"><i class="fa fa-phone"></i>' + locationPhone + '</span></div></div></div></div>')
    }

    function getCurrentCruisesData() {
        let cd = new Date(2019, 4, 18, 13, 10 );
        let c_date = cd.toISOString().substring(0, 10) + 'T00:00:00Z';
        let current_tours_url = 'https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=ship-id,route,days,start,end,tour-points,is-online-sale,price-from&include=ship&filter[start][lte]=2019-05-18T10:00:00Z&filter[is-online-sale]=1&&filter[end][gte]=2019-05-18T13:00:00Z&per-page=40';
        let loc = [];
        $.getJSON(current_tours_url, function (tours) {
            for(let index=0; index < tours.data.length; index++) {
                let locURL = '/riverships/' + tours.data[index].attributes['ship-id'];
                let locCategory = 'Теплоход';
                let locImg = '/assets/img/mtf/ships/' + tours.data[index].attributes['ship-id'] + '.jpg';
                let locTitle = '';
                let locAddress = tours.data[index].attributes.route;
                let locPhone = moment(tours.data[index].attributes.start).format('DD MMMM') + ' - ' + moment(tours.data[index].attributes.end).format('DD MMMM');
                let locRating = 5;
                let locReviews = '';
                let lat = 0;
                let lon = 0;

                $.map(tours.included, function (ship) {
                    if (parseInt(tours.data[index].attributes['ship-id']) === parseInt(ship.id)) {
                        locTitle = ship.attributes.name;
                    }
                });
                $.getJSON('https://api.mosturflot.ru/v3/rivercruises/tours/' + tours.data[index].id + '/tour-points', function (points) {
                    for (let i = 0; i < points.data.length; i++) {
                        let j = i;
                        //let arr = [];
                        if (moment('2019-05-18T10:00:00Z').isAfter(points.data[i].attributes.arrive) && moment('2019-05-18T10:00:00Z').isBefore(points.data[i].attributes.departure)) {
                            locReviews = 'стоянка ' + points.data[i].attributes.name;

                        }

                        if (moment('2019-05-18T10:00:00Z').isAfter(points.data[i].attributes.departure) && moment('2019-05-18T10:00:00Z').isBefore(points.data[j + 1].attributes.arrive)) {
                            locReviews = 'переход до остановки ' + points.data[i].attributes.name;
                        }


                        $.map(cities_data, function (city) {
                            if (city.name === points.data[i].attributes.name) {
                                lat = city.latitude;
                                lon = city.longitude;
                                let arr = [locationData(locURL, locCategory, locImg, locTitle, locAddress, locPhone, locRating, locReviews), lat, lon, 10, markerIcon];
                                loc[index] = arr;
                                //console.log(loc);
                                if (tours.data.length === index + 1 && points.data.length === i + 1 ) {
                                    //console.log(loc[0]);
                                    mainMap(loc);
                                }
                            }
                        });
                    }
                });

            }//tours.data
        });
    }



    /******* end current cruises data ******/

    function mainMap(locations) {
        //console.log(locations);
        var map = new google.maps.Map(document.getElementById('map-main'), {
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


        var boxText = document.createElement("div");
        boxText.className = 'map-box'
        var currentInfobox;
        var boxOptions = {
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
        var markerCluster, marker, i;
        var allMarkers = [];
        var clusterStyles = [{
            textColor: 'white',
            url: '',
            height: 50,
            width: 50
        }];

        var bounds  = new google.maps.LatLngBounds();
        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                icon: locations[i][4],
                id: i
            });
            allMarkers.push(marker);
            var loc = new google.maps.LatLng(locations[i][1], locations[i][2]);
            bounds.extend(loc);
            var ib = new InfoBox();
            /**google.maps.event.addListener(ib, "domready", function () {
                cardRaining()
            });*/
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    ib.setOptions(boxOptions);
                    boxText.innerHTML = locations[i][0];
                    ib.close();
                    ib.open(map, marker);
                    currentInfobox = marker.id;
                    var latLng = new google.maps.LatLng(locations[i][1], locations[i][2]);
                    map.panTo(latLng);
                    map.panBy(0, -180);
                    google.maps.event.addListener(ib, 'domready', function () {
                        $('.infoBox-close').click(function (e) {
                            e.preventDefault();
                            ib.close();
                        });
                    });
                }
            })(marker, i));
        }
        var options = {
            imagePath: '/assets/img/mtf/',
            styles: clusterStyles,
            minClusterSize: 2
        };
        markerCluster = new MarkerClusterer(map, allMarkers, options);
        google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
            map.fitBounds(bounds);
        });

        $('.nextmap-nav').click(function (e) {
            e.preventDefault();
            map.setZoom(15);
            var index = currentInfobox;
            if (index + 1 < allMarkers.length) {
                google.maps.event.trigger(allMarkers[index + 1], 'click');
            } else {
                google.maps.event.trigger(allMarkers[0], 'click');
            }
        });
        $('.prevmap-nav').click(function (e) {
            e.preventDefault();
            map.setZoom(15);
            if (typeof (currentInfobox) == "undefined") {
                google.maps.event.trigger(allMarkers[allMarkers.length - 1], 'click');
            } else {
                var index = currentInfobox;
                if (index - 1 < 0) {
                    google.maps.event.trigger(allMarkers[allMarkers.length - 1], 'click');
                } else {
                    google.maps.event.trigger(allMarkers[index - 1], 'click');
                }
            }
        });
        $('.map-item').click(function (e) {
            e.preventDefault();
            map.setZoom(15);
            var index = currentInfobox;
            var marker_index = parseInt($(this).attr('href').split('#')[1], 10);
            google.maps.event.trigger(allMarkers[marker_index], "click");
            if ($(this).hasClass("scroll-top-map")){
                $('html, body').animate({
                    scrollTop: $(".map-container").offset().top+ "-80px"
                }, 500)
            }
            else if ($(window).width()<1064){
                $('html, body').animate({
                    scrollTop: $(".map-container").offset().top+ "-80px"
                }, 500)
            }
        });
        // Scroll enabling button
        var scrollEnabling = $('.scrollContorl');

        $(scrollEnabling).click(function(e){
            e.preventDefault();
            $(this).toggleClass("enabledsroll");

            if ( $(this).is(".enabledsroll") ) {
                map.setOptions({'scrollwheel': true});
            } else {
                map.setOptions({'scrollwheel': false});
            }
        });
        var zoomControlDiv = document.createElement('div');
        var zoomControl = new ZoomControl(zoomControlDiv, map);

        function ZoomControl(controlDiv, map) {
            zoomControlDiv.index = 1;
            map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(zoomControlDiv);
            controlDiv.style.padding = '5px';
            var controlWrapper = document.createElement('div');
            controlDiv.appendChild(controlWrapper);
            var zoomInButton = document.createElement('div');
            zoomInButton.className = "mapzoom-in";
            controlWrapper.appendChild(zoomInButton);
            var zoomOutButton = document.createElement('div');
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
    var map = document.getElementById('map-main');
    if (typeof (map) != 'undefined' && map != null) {
        getCurrentCruisesData();
        //google.maps.event.addDomListener(window, 'load', mainMap);
    }

    function singleMap() {
        var myLatLng = {
            lng: $('#singleMap').data('longitude'),
            lat: $('#singleMap').data('latitude'),
        };
        var single_map = new google.maps.Map(document.getElementById('singleMap'), {
            zoom: 14,
            center: myLatLng,
            scrollwheel: false,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            panControl: false,
            navigationControl: false,
            streetViewControl: false,
            styles: [{
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{
                    "color": "#f2f2f2"
                }]
            }]
        });
        var markerIcon2 = {
            url: '/assets/img/mtf/ship.png',
        }
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: single_map,
            icon: markerIcon2,
            title: 'Our Location'
        });
        var zoomControlDiv = document.createElement('div');
        var zoomControl = new ZoomControl(zoomControlDiv, single_map);

        function ZoomControl(controlDiv, single_map) {
            zoomControlDiv.index = 1;
            single_map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(zoomControlDiv);
            controlDiv.style.padding = '5px';
            var controlWrapper = document.createElement('div');
            controlDiv.appendChild(controlWrapper);
            var zoomInButton = document.createElement('div');
            zoomInButton.className = "mapzoom-in";
            controlWrapper.appendChild(zoomInButton);
            var zoomOutButton = document.createElement('div');
            zoomOutButton.className = "mapzoom-out";
            controlWrapper.appendChild(zoomOutButton);
            google.maps.event.addDomListener(zoomInButton, 'click', function () {
                single_map.setZoom(single_map.getZoom() + 1);
            });
            google.maps.event.addDomListener(zoomOutButton, 'click', function () {
                single_map.setZoom(single_map.getZoom() - 1);
            });
        }
    }
    var single_map = document.getElementById('singleMap');
    if (typeof (single_map) != 'undefined' && single_map != null) {
        google.maps.event.addDomListener(window, 'load', singleMap);
    }
//})();
