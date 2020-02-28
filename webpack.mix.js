let mix = require('laravel-mix');
const customMedia = require('postcss-custom-media');
const customProperties = require('postcss-custom-properties');
const mqpacker = require('css-mqpacker');

mix.autoload({ jquery: ['$', 'window.jQuery'], moment: ['moment'] })
    .js('_src/js/app.js', 'assets/js/')
    .sass('_src/scss/app.scss', 'assets/css/')
    .options({
        postCss: [
            customProperties(),        
            customMedia(),
            require('lost'),
            mqpacker({
                sort: sortMediaQueries,
            }),
        ]
    })
    .extract()
    .minify(['assets/js/app.js', 'assets/css/app.css']);


function isMax(mq) {
    return /max-width/.test(mq);
}

function isMin(mq) {
    return /min-width/.test(mq);
}

function sortMediaQueries(a, b) {
    A = a.replace(/\D/g, '');
    B = b.replace(/\D/g, '');

    if (isMax(a) && isMax(b)) {
        return B - A;
    } else if (isMin(a) && isMin(b)) {
        return A - B;
    } else if (isMax(a) && isMin(b)) {
        return 1;
    } else if (isMin(a) && isMax(b)) {
        return -1;
    }

    return 1;
}