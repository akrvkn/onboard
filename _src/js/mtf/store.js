function initRiverData(cb)
{
    'use strict';

    //localStorage.clear();

    let d = new Date();
    let current_date = d.toISOString().substring(0, 10);
    let url = 'https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=ship-id,route,days,start,end,min-price&include=ship,ship-title-image&fields[ships]=name&filter[start][gte]=' + current_date + 'T00:00:00Z&per-page=20';
    let revision = '01';

    let isLocalStorage = 'localStorage' in window && window[ 'localStorage' ] !== null,
        request,
        apiToursData,
        MTFData,
        storeIT = function()
        {
            MTFData = JSON.parse(apiToursData);
            cb(MTFData);
            //console.log(MTFData);
            //return true;
        };

    if( isLocalStorage && localStorage.getItem( 'revisionETag' ) !== null )
    {
        revision = localStorage.getItem('revisionETag');
        //console.log(revision);
    }

    try
    {
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader("If-None-Match", revision);
        request.onload = function () {
            //console.log(request.status);
            switch (request.status) {
                case 200:
                    apiToursData = request.responseText;
                    storeIT();
                    if (isLocalStorage) {
                        localStorage.setItem('inlineToursData', apiToursData);
                        localStorage.setItem('revisionETag', request.getResponseHeader('ETag'));
                    }
                    break;
                case 304:
                    apiToursData = localStorage.getItem('inlineToursData');
                    storeIT();
                    break;
                default:
                    if (isLocalStorage) {
                        apiToursData = localStorage.getItem('inlineToursData');
                    }
            }
        };
        request.send();
    }
    catch( e ){}
}
