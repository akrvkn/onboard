//'use strict';
    const markerIcon = {
        anchor: new google.maps.Point(22, 16),
        url: '/assets/img/mtf/marker-ship.png',
    };
    const markerPointIcon = {
        anchor: new google.maps.Point(22, 16),
        url: '/assets/img/mtf/marker.png',
    };

    function locationData(locationURL, locationCategory, locationImg, locationTitle, locationAddress, locationPhone, locationStarRating, locationRevievsCounter) {
        return ('<div class="map-popup-wrap"><div class="map-popup"><div class="infoBox-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" width="30" height="30"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></div><div class="map-popup-category">' + locationCategory + '</div><a href="' + locationURL + '" class="listing-img-content fl-wrap"><img src="' + locationImg + '" alt=""></a> <div class="listing-content fl-wrap"><div class="card-popup-raining map-card-rainting"><span class="map-popup-reviews-count">Ближайшая остановка ( ' + locationRevievsCounter + ' )</span></div><div class="listing-title fl-wrap"><h4><a href=' + locationURL + '>' + locationTitle + '</a></h4><span class="map-popup-location-info"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12"><path fill="currentColor" d="M416 320h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96s96-107 96-160-43-96-96-96-96 43-96 96c0 25.5 22.2 63.4 45.3 96H320c-52.9 0-96 43.1-96 96s43.1 96 96 96h96c17.6 0 32 14.4 32 32s-14.4 32-32 32H185.5c-16 24.8-33.8 47.7-47.3 64H416c52.9 0 96-43.1 96-96s-43.1-96-96-96zm0-256c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zM96 256c-53 0-96 43-96 96s96 160 96 160 96-107 96-160-43-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path></svg>  ' + locationAddress + '</span><span class="map-popup-location-phone"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12"><path fill="currentColor" d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h288c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-64zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path></svg>  ' + locationPhone + '</span></div></div></div></div>')
    }

    function mainMap(locations) {
        //console.log(locations);
        let map = new google.maps.Map(document.getElementById('map-main'), {
            zoom: 5,
            scrollwheel: true,
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


        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                icon: locations[i][4],
                id: i
            });
            allMarkers.push(marker);
            let ib = new InfoBox();
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
                    let latLng = new google.maps.LatLng(locations[i][1], locations[i][2]);
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

        $('.nextmap-nav').click(function (e) {
            e.preventDefault();
            map.setZoom(15);
            let index = currentInfobox;
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
                let index = currentInfobox;
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



    let routeMap = document.getElementById('route-map');
    if (typeof (routeMap) != 'undefined' && routeMap != null) {
        //getSelectedCruiseData();
    }

    let map = document.getElementById('map-main');
    if (typeof (map) != 'undefined' && map != null) {
        getOnlineShipsData();
        console.log('map-main');
        //getCurrentCruisesData();
        //google.maps.event.addDomListener(window, 'load', mainMap);
    }

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

    function getSelectedCruiseData(){
        let tourId = parseUrlQuery('tour')===''?'4979':parseUrlQuery('tour');
        let routePointsURL = 'https://api.mosturflot.ru/v3/rivercruises/tour-points?filter[tour-id]=' + tourId + '&fields[tour-points]=name&include=tour';
        let tourPoints = [];
        let cities = [];
        $.getJSON(routePointsURL, function (points) {
            //console.log(points.included[0].attributes.route);
            let coords = [];
            $.map(points.data, function (point, index) {
                if(point.attributes.name) {
                    $.map(cities_data, function (pt) {

                        if (point.attributes.name.indexOf(pt.name) > -1 && cities.indexOf(pt.name) === -1) {
                            tourPoints.push(pt);
                            cities.push(pt.name);
                        }

                    });
                }
                if(points.data.length === index + 1) {

                    renderRouteMap(tourPoints, coords);
                    //console.log(tourPoints);
                }
            });
        });
    }


    function getCurrentCruisesData() {
        let c_date = moment().format('YYYY-MM-DD');
        let c_date_plus = moment().add('1', 'days').format('YYYY-MM-DD');
        //console.log(c_date, c_date_plus);
        let current_points_url = 'https://api.mosturflot.ru/v3/rivercruises/tour-points?filter[date][gte]=' + c_date + '&filter[date][lte]=' + c_date_plus + '&filter[is-own]=1&include=tour,tour.ship&fields[tour-points]=tour-id,date,arrive,departure,point-id,name&fields[tours]=ship-id,start,finish,route&fields[ships]=id,name&per-page=100';
        let loc = [];
        let locURL = '';
        let locCategory = 'Теплоход';
        let locImg = '';
        let locTitle = '';
        let locAddress = '';
        let locPhone = '';
        let locRating = 5;
        let locReviews = '';

        let tours = {};
        let ships = {};
        let city = false;
        let counter = 0;
        let shiptours = {};
        const shipsTrans = [
            { id: "5", name: "Obraztsov"},
            {id: "14", name: "Surikov"},
            {id: "19", name: "Krasin"},
            {id: "36", name: "Repin"},
            {id: "72", name: "Anastasiya"},
            {id: "91", name: "Pushkin"},
            {id: "92", name: "Karamzin"},
            {id: "139", name: "Krilov"},
            {id: "150", name: "Esenin"},
            {id: "198", name: "Bulgakov"},
            {id: "200", name: "Rublev"},
            {id: "206", name: "Viktoriya"},
            {id: "207", name: "Grin"},
            {id: "247", name: "Rossiya"}
        ];
        $.getJSON('https://www.superuser.su/services/online.php', function(onlineData) {
            let currentShipsPosition = {};
            $.map(onlineData, function (son, count) {
                $.map(shipsTrans, function(trans, key){
                    if(trans.name === son.name) {
                        currentShipsPosition[trans.id] = son;
                    }
                });
                if(onlineData.length === count + 1){
                    //console.log(currentShipsPosition);

            $.getJSON(current_points_url, function (points) {
                $.map(points.included, function (ship, j) {
                    if (ship.type === 'ships') {
                        ships[ship.id] = ship.attributes.name;

                    }
                    if (points.included.length === j + 1) {
                        $.map(points.included, function (included, x) {
                            if (included.type === 'tours' && currentShipsPosition.hasOwnProperty(included.attributes['ship-id'])) {
                                tours[included.id] = {};
                                if (shiptours.hasOwnProperty(included.attributes['ship-id']) === false ) {
                                    tours[included.id]['lat'] = parseFloat(currentShipsPosition[included.attributes['ship-id']].latitude);
                                    tours[included.id]['lon'] = parseFloat(currentShipsPosition[included.attributes['ship-id']].longitude);
                                    shiptours[included.attributes['ship-id']] = included.attributes['ship-id'];
                                    tours[included.id]['shipid'] = included.attributes['ship-id'];
                                    tours[included.id]['name'] = ships[included.attributes['ship-id']];
                                    tours[included.id]['route'] = included.attributes['route'];
                                    tours[included.id]['start'] = included.attributes['start'];
                                    tours[included.id]['finish'] = included.attributes['finish'];
                                }

                            }

                            if (points.included.length === x + 1) {
                                $.map(points.data, function (point, index) {
                                    if (tours.hasOwnProperty(point.attributes['tour-id']) && tours[point.attributes['tour-id']]['lat'] !== undefined) {
                                        //console.log(tours[point.attributes['tour-id']]['lat']);
                                        $.map(cities_data, function (pt) {
                                            if (point.attributes.name === pt.name) {
                                                //console.log(tours[point.attributes['tour-id']]['shipid']);
                                                tours[point.attributes['tour-id']]['lat'] = pt.latitude - Math.random() / 1000;
                                                tours[point.attributes['tour-id']]['lon'] = pt.longitude - Math.random() / 1000;
                                            }
                                        });


                                        tours[point.attributes['tour-id']]['review'] = 'фото';

                                        locURL = '/riverships/' + tours[point.attributes['tour-id']]['shipid'];
                                        locImg = '/assets/img/mtf/ships/' + tours[point.attributes['tour-id']]['shipid'] + '.jpg';
                                        locAddress = tours[point.attributes['tour-id']]['route'];
                                        locTitle = tours[point.attributes['tour-id']]['name'];
                                        locPhone = moment(tours[point.attributes['tour-id']]['start']).format('DD MMMM') + ' - ' + moment(tours[point.attributes['tour-id']]['finish']).format('DD MMMM');
                                        locReviews = tours[point.attributes['tour-id']]['review'];
                                        //let arr = [locationData(locURL, locCategory, locImg, locTitle, locAddress, locPhone, locRating, locReviews), lat, lon, 10, markerIcon];
                                        if (tours[point.attributes['tour-id']].hasOwnProperty('shipid') && tours[point.attributes['tour-id']].hasOwnProperty('lat') && tours[point.attributes['tour-id']].hasOwnProperty('lon')) {
                                            loc[counter] = [locationData(locURL, locCategory, locImg, locTitle, locAddress, locPhone, locRating, locReviews), tours[point.attributes['tour-id']]['lat'], tours[point.attributes['tour-id']]['lon'], 10, markerIcon];
                                            //console.log(loc);
                                            counter++;
                                        }
                                        //});
                                    }
                                    if (points.data.length === index + 1) {
                                        //console.log(loc);
                                        mainMap(loc);
                                    }

                                });
                            }


                        });
                    }
                });

            });
                }
            });
        });
    }//end function getCurrentCruisesData





function onlineMap(locations) {
    //console.log(locations);
    let map = new google.maps.Map(document.getElementById('map-main'), {
        zoom: 5,
        scrollwheel: true,
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


    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i]['latitude'], locations[i]['longitude']),
            icon: '/assets/img/mtf/marker-ship.png',
            id: i
        });
        allMarkers.push(marker);
        let ib = new InfoBox();
        /**google.maps.event.addListener(ib, "domready", function () {
                cardRaining()
            });*/
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                ib.setOptions(boxOptions);
                boxText.innerHTML = '<div class="map-popup-wrap"><div class="map-popup"><div class="infoBox-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" width="30" height="30"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></div><div class="map-popup-category">' + locations[i]['name'] + '</div><a href="https://www.mosturflot.ru/api/ajax/image.php?src=' + locations[i]['name'] + '" class="listing-img-content fl-wrap" target="_blank"><img src="https://www.mosturflot.ru/api/ajax/image.php?src=' + locations[i]['name'] + '" alt="" style="height: 150px;"></a> <div class="listing-content fl-wrap"><div class="listing-title fl-wrap"><h4><a href="https://www.mosturflot.ru/api/ajax/image.php?src=' + locations[i]['name'] + '" target="_blank">' + locations[i]['name'] + '</a></h4></div></div></div></div>';
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
        })(marker, i));
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

function getOnlineShipsData(){
    //let shipsOnline = [];
    $.getJSON('https://www.superuser.su/services/online.php', function(onlineData) {
        //console.log(onlineData);
        onlineMap(onlineData);
    });
}

