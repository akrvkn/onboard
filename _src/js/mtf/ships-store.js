;( function( window)
{
    'use strict';
    //localStorage.clear();

    let ships_url = 'https://api.mosturflot.ru/v3/rivercruises/ships?filter[is-own]=1&include=ship-class';
    let rev = '01';

    let isLocalStore = 'localStorage' in window && window[ 'localStorage' ] !== null,
        req,
        apiShipsData,
        MTFShips,
        storeShips = function()
        {
            MTFShips = JSON.parse(apiShipsData);
            let $ships_block = $('#river_cruise_ships');
            if($ships_block.length > 0) {

                renderMTFShips(MTFShips);
            }
            //console.log(MTFData);
            return true;
        };

    if( isLocalStore && localStorage.getItem( 'shipsETag' ) !== null )
    {
        rev = localStorage.getItem('shipsETag');
        //console.log(revision);
    }

    try
    {
        req = new XMLHttpRequest();
        req.open('GET', ships_url, true);
        req.setRequestHeader("If-None-Match", rev);
        req.onload = function () {
            console.log(req.status);
            switch (req.status) {
                case 200:
                    apiShipsData = req.responseText;
                    storeShips();
                    if (isLocalStore) {
                        localStorage.setItem('inlineShipsData', apiShipsData);
                        localStorage.setItem('shipsETag', req.getResponseHeader('ETag'));
                    }
                    break;
                case 304:
                    apiShipsData = localStorage.getItem('inlineShipsData');
                    storeShips();
                    break;
                default:
                    if (isLocalStore) {
                        apiShipsData = localStorage.getItem('inlineShipsData');
                    }
            }
        };
        req.send();
    }
    catch( e ){}
    
}( window ) );