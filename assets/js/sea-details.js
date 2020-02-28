moment.locale('ru');

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
    let cruise_id = parseUrlQuery('tour');

    /*$("#seabooking-submit").on("click", function (ev) {
        ev.preventDefault();
        let str = $('#seacruise-booking').serialize();
        if($("#mobile-h").val()===''){
            $.post( "https://script.google.com/macros/s/AKfycbxFDPnE3pWQD2j7XbKjH1SY5hnocDII3DRrtOoYYXKTIABVgOM/exec", str)
                .done(function( data ) {
                    if(data.result === 'success') {
                        alert("Ваша заявка отправлена");
                    }

                });
            //$.post( "https://script.google.com/macros/s/AKfycbxFDPnE3pWQD2j7XbKjH1SY5hnocDII3DRrtOoYYXKTIABVgOM/exec", str );
        }
    });*/

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
            map.setZoom(10);
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
        let route = '';
        let tbody = '';
        let markers = [];
        let ports = [];
        $.each( data.route_items, function(k, v) {
            route += v.port + ' - ';
            let marker = {};
            if(v.place && ports.indexOf( v.port ) === -1) {
                if(v.place.latitude !== '' && v.place.longitude !== '') {
                    ports.push(v.port);
                    marker['name'] = v.port;
                    marker['latitude'] = v.place.latitude;
                    marker['longitude'] = v.place.longitude;
                    markers.push(marker);
                }
            }
            if( k + 1 === data.route_items.length){
                renderRouteMap(markers);
                $('#sea_shedule_table').append(tbody);
            }
            let country = v.place === null ? '' : v.place.country === null?'': v.place.country.name_ru;
            tbody += '<tr><td>' + v.day_num + '</td><td>' + country + '</td><td>' + v.port + '</td><td>' + v.arrival_time + '</td><td>' + v.departure_time + '</td></tr>';

        });


        $('#searoute').html(route.substring(0, route.length - 3));
        $('#ship-comp').append(data.comp.title);
        $('#sea-company').append(data.comp.title);
        $('#ship-nights').append(data.nights);
        $('.cruise-nights').append(data.nights);
        $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/companies.json').done(function( comp ) {
            let shipclass = '';
            $.each(comp, function(key, val){
                if(val.id===data.comp.id){
                    shipclass = val.service_category.title;
                    $('#ship-class').append(val.service_category.title);
                    let desc = $(val.description).find('*').removeAttr("class");
                    //let desc = $(val.description).replace(/<.*?>/g, '');
                    let included = $(val.cruise_included);
                    $('#cruise-included').html(included);
                    //console.log(desc);
                    $('#sea_company_desc').html(desc);
                }
            });

            $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/?cruise/'+cruise_id+'/departures').done(function( json ) {
                let ship_id = json[0].assigned_ship.id;
                $('#seaship').html(json[0].assigned_ship.title);
                $('#ship-date-start').append( moment(json[0].date, moment.ISO_8601).format('YYYY DD MMM, dddd'));
                //console.log(json[0].rus_groups);
                let rus = json[0].rus_groups===null?'Нет':'Да';
                $('#ship-rus').append(rus);
                $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/ships/shipsimages.json').done(function( img ) {
                    $('#seaimage').attr('src', img[ship_id].image);
                });
                let cabins = {};
                $.each( json[0].price_items, function(key, val){
                    let currency = val.currency=='usd'?'$':'&euro;';
                    $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/?room/'+val.room.id).done(function( room ) {
                        let description = room.room_description === undefined?'':room.room_description.replace(/<.*?>/g, ' ');
                        //let description = room.room_description === undefined?'':room.room_description;
                        $.getJSON( 'https://www.mosturflot.ru/api/ajax/sea/?image/'+room.room_image).done(function( image ) {
                            let popup_content = '<div id="' + val.room.title_lat + '" class="modal_form">\n' +
                                '<div class="close_button" onclick="$(\'' + '#' + val.room.title_lat + '\').hide();">X</div>' +
                                '<div class="phone-signup">\n' +
                                '    <form method="post" action="https://script.google.com/macros/s/AKfycbxFDPnE3pWQD2j7XbKjH1SY5hnocDII3DRrtOoYYXKTIABVgOM/exec">\n' +
                                '        <div class="form-group">\n' +
                                '            <label id="form-seacruise-id">Круиз № ' + cruise_id + '</label>\n' +
                                '        </div>\n' +
                                '        <div class="form-group">\n' +
                                '            <label id="form-seacruise-cabin">Категория каюты: ' + val.room.title_lat + '</label>\n' +
                                '        </div>\n' +
                                '        <div class="form-group">\n' +
                                '            <input type="text" name="name" class="input-text full-width" placeholder="имя, фамилия">\n' +
                                '        </div>\n' +
                                '        <div class="form-group">\n' +
                                '            <input type="text" name="phone" class="input-text full-width" placeholder="телефон">\n' +
                                '        </div>\n' +
                                '        <div class="form-group">\n' +
                                '            <input type="text" name="email" class="input-text full-width" placeholder="электронная почта">\n' +
                                '        </div>\n' +
                                '        <div class="form-group">\n' +
                                '            <input type="text" name="parents" maxlength="2" class="input-text full-width" placeholder="кол-во взрослых">\n' +
                                '        </div>\n' +
                                '        <div class="form-group">\n' +
                                '            <input type="text" name="child" maxlength="2" class="input-text full-width" placeholder="кол-во детей">\n' +
                                '        </div>\n' +
                                '        <div class="form-group">\n' +
                                '            <div class="checkbox">\n' +
                                '                <label>\n' +
                                '                    <input type="checkbox" name="subscription" value=""> Получать специальные сообщения компании\n' +
                                '                </label>\n' +
                                '            </div>\n' +
                                '        </div>\n' +
                                '        <div class="form-group">\n' +
                                '            <p class="description" style="font-size: smaller">Не возражаю против того, чтобы предоставленная мной информация хранилась и обрабатывалась в базе данных компании.</p>\n' +
                                '        </div>' +
                                '        <input type="text" name="cruise-id" class="hidden" value="https://www.mosturflot.ru/seacruises/seacruise?tour=' + cruise_id + '">' +
                                '        <input type="text" name="cabin-cat" class="hidden" value="' + val.room.title_lat + '">' +
                                '        <input type="text" name="mobile" class="hidden mobile-h" placeholder="телефон" value="">' +
                                '        <p style="padding-top: 10px;text-align: center"><button type="submit" class="btn btn_common">ОТПРАВИТЬ</button></p>' +
                                '    </form>\n' +
                                '</div>\n' +
                                '</div>';

                            let image_file = 'https://www.viamaris.ru'+image.file;
                            let cabin = '<li class="ships__cabin">\n' +
                                '<a href="#" class="ships-item"><span class="ships-item__img"><picture><img src="'+ image_file + '"></picture></span>' +
                                '<span class="tours-item__date">Категория: ' + val.room.title_lat + '</span>\n' +
                                '<span class="ships-item__text">' + description + '</span>\n' +
                                '<span class="tours-item__prices">' + currency + ' ' + val.price.substring(0, val.price.length-3) + '  </span>\n' +
                                '</a>\n' +
                                '<p style="padding-top: 10px;text-align: center"><a href="#" class="btn btn_common" onclick="$(\'' + '#' + val.room.title_lat + '\').show();" alt="Заказать">Заказать</a></p>' +
                                '</li>';
                                $('#seamodal-wrap').append(popup_content);

                            //$('#ship-cabins').append(cabin);
                            cabins[val.price.substring(0, val.price.length-3)] = cabin;
                            if(key === (json[0].price_items.length-1)){
                                $.each(cabins, function(a, b){
                                    //console.log(b);
                                    $('#sea_cruise_cabins').append(b);
                                })
                            }
                        });
                    });
                });
            });
        });
    });

});
