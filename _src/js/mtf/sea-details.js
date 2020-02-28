

$(document).ready(function() {
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
    var cruise_id = parseUrlQuery('tour');

    function renderRouteMap(locations) {
        let map = new google.maps.Map(document.getElementById('sea-map'), {
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
        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i]['latitude'], locations[i]['longitude']),
                icon: '/assets/img/mtf/marker.png',
                id: i
            });
            allMarkers.push(marker);
            let loc = new google.maps.LatLng(locations[i]['latitude'], locations[i]['longitude']);
            bounds.extend(loc);
            if(i === locations.length - 1){
                map.fitBounds(bounds);
            }
            let ib = new InfoBox();
            /**google.maps.event.addListener(ib, "domready", function () {
                cardRaining()
            });*/
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
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


    $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/?cruise/'+cruise_id).done(function( data ) {
        var route = '';
        var tbody = '';
        var markers = [];
        $.each( data.route_items, function(k, v) {
            route += v.port + ' - ';
            var marker = {};
            if(v.place) {
                marker['name'] = v.port;
                marker['latitude'] = v.place.latitude;
                marker['longitude'] = v.place.longitude;
                markers.push(marker);
            }
            if( k + 1 === data.route_items.length){
                renderRouteMap(markers);
            }
                var country = v.place === null ? '' : v.place.country === null?'': v.place.country.name_ru;
                tbody += '<tr><td>' + v.day_num + '</td><td>' + country + '</td><td>' + v.port + '</td><td>' + v.arrival_time + '</td><td>' + v.departure_time + '</td></tr>';

        });

        /*$("#sea-map").gmap3({
            map: {
                options: {
                    center: [data.route_items[0].place.latitude, data.route_items[0].place.longitude],
                    zoom: 3
                }
            },
            marker:{
                values: markers,
                options: {
                    draggable: false
                },
                autofit: {}
            }
        });*/

        $('#cruise-schedule').html(tbody);
        $('#routedesc').html(route.substring(0, route.length - 3));
        $('#ship-comp').append(data.comp.title);
        $('#ship-nights').append(data.nights);
        $('.cruise-nights').append(data.nights);
        $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/companies.json').done(function( comp ) {
            var shipclass = '';
            $.each(comp, function(key, val){
                if(val.id===data.comp.id){
                    shipclass = val.service_category.title;
                    $('#ship-class').append(val.service_category.title);
                    var desc = $(val.description).find('*').removeAttr("class");
                    $('#comp').html(desc);
                }
            });

        $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/?cruise/'+cruise_id+'/departures').done(function( json ) {
            var ship_id = json[0].assigned_ship.id;
            $('#seaship').html(json[0].assigned_ship.title);
            $('#ship-date-start').append( moment(json[0].date, moment.ISO_8601).format('YYYY DD MMM, dddd'));
            //console.log(json[0].rus_groups);
            var rus = json[0].rus_groups===null?'Нет':'Да';
            $('#ship-rus').append(rus);
            $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/ships/shipsimages.json').done(function( img ) {
                console.log(img[ship_id].image);
                $('#shiptitleimage').attr('src', img[ship_id].image);
            });
            var cabins = {};
            $.each( json[0].price_items, function(key, val){
                var currency = val.currency=='usd'?'$':'&euro;';
                $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/?room/'+val.room.id).done(function( room ) {
                    var description = room.room_description === undefined?'':room.room_description.replace(/<.*?>/g, '');
                    $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/?image/'+room.room_image).done(function( image ) {
                        var image_file = 'https://www.viamaris.ru'+image.file;
                var cabin = '<article id="' + val.price.substring(0, val.price.length-3) + '" class="box">\n' +
                    '<figure class="col-sm-5 col-md-4">\n' +
                    '<a title="" href="#" class="hover-effect"><img width="270" height="160" alt="" src="'+image_file+'"></a>\n' +
                    '</figure>\n' +
                    '<div class="details col-xs-12 col-sm-7 col-md-8">\n' +
                    '<div>\n' +
                    '<div>\n' +
                    '<h4 class="box-title">'+val.room.title+'<small><i class="soap-icon-key yellow-color"></i> КАТЕГОРИЯ '+val.room.title_lat +'</small></h4>\n' +
                    '<div class="amenities">\n' +
                    '<i class="soap-icon-wifi circle"></i>\n' +
                    '<i class="soap-icon-fitnessfacility circle"></i>\n' +
                    '<i class="soap-icon-fork circle"></i>\n' +
                    '<i class="soap-icon-television circle"></i>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '<div>\n' +
                    '<span class="review ship-class">'+shipclass+'</span>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '<div>\n' +
                    '<p>'+description+'</p>\n' +
                    '<div>\n' +
                    '<span class="price"><small>НОЧЕЙ '+data.nights +'</small>'+ currency + val.price.substring(0, val.price.length-3) +  '</span>\n' +
                    '<a href="#seacruise-signup" class="booking-popupbox button btn-small" data-cat="'+val.room.title_lat+'">ЗАКАЗАТЬ</a>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</article>';
                //$('#ship-cabins').append(cabin);
                        cabins[val.price.substring(0, val.price.length-3)] = cabin;
                        if(key === (json[0].price_items.length-1)){
                            $.each(cabins, function(a, b){
                                $('#ship-cabins').append(b);
                            })
                        }
                    });
                });
            });
        });
        });
    });

});
