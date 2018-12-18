// Paths
const path = {
    'css': './assets/css',
    'js': './assets/js',
    'fonts': './assets/fonts',
    'images': './assets/images',
    'sass': './assets/sass',
    'templates': './assets/templates',
    'pdf': './assets/pdf',
    'maps': './maps',
    'node_modules': './node_modules',
    'dist': './dist',
    'services': './dist/services'
};

// Requirements
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const order = require('gulp-order');
const image = require('gulp-image');
const html = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');

// Moving third-party lib
gulp.task( 'third-party', function () {

    // JQUERY
    gulp.src( `${path.node_modules}/jquery/dist/jquery.js` )
        .pipe( gulp.dest( path.js ) );

    // BOOTSTRAP JS
    gulp.src( `${path.node_modules}/bootstrap/dist/js/bootstrap.bundle.js` )
        .pipe( gulp.dest( path.js ) );
    
    // FONTAWESOME WEBFONTS
    gulp.src( `${path.node_modules}/@fortawesome/fontawesome-free/webfonts/**/*.*` )
        .pipe( gulp.dest( `${path.dist}/fonts` ) );
    
    // SLICK JS
    gulp.src( `${path.node_modules}/slick-carousel/slick/slick.js` )
    .pipe( gulp.dest( path.js ) );
    
    // SLICK FONTS
    gulp.src( `${path.node_modules}/slick-carousel/slick/fonts/**/*.*` )
        .pipe( gulp.dest( `${path.dist}/fonts` ) );

});

// Moving Images
gulp.task( 'assets-images', function () {

    gulp.src( [`${path.images}/**/*.*`, `!**/_*.*`] )
        .pipe( image() )
        .pipe( gulp.dest( `${path.dist}/images` ));

    gulp.src( `${path.images}/**/_*.*` )
        .pipe( gulp.dest( `${path.dist}/images` ));

});

// Moving Fonts
gulp.task( 'assets-fonts', function () {

    gulp.src( `${path.fonts}/**/*.*` )
        .pipe( gulp.dest( `${path.dist}/fonts` ));

});

// Moving PDF
gulp.task( 'assets-pdf', function () {

    gulp.src( `${path.pdf}/**/*.*` )
        .pipe( gulp.dest( `${path.dist}/pdf` ));

});

// Compiling Sass files
gulp.task( 'compile-sass', function () {

    gulp.src( [`${path.sass}/**/*.{sass, scss}`, '!/header-footer'] )
        .pipe( sourcemaps.init() )
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 8
        }))
        .on( 'error', sass.logError )
        .pipe( sourcemaps.write( path.maps ) )
        .pipe( gulp.dest( path.dist ) );

});

// Compiling Sass files for services
gulp.task( 'compile-sass-services', function () {

    gulp.src( `${path.sass}/header-footer/*.{sass, scss}` )
        .pipe( sourcemaps.init() )
        .pipe(sass({
            /*outputStyle: 'compressed',*/
            precision: 8
        }))
        .on( 'error', sass.logError )
        .pipe( sourcemaps.write( './maps' ) )
        .pipe( gulp.dest( path.services ) );

});
-
// Concat and Uglify js files
gulp.task( 'scripts', function(){

    return gulp.src( `${path.js}/**/*.js` )
        .pipe( sourcemaps.init() )
        .pipe(order([
            'jquery.js',
            'bootstrap.bundle.js',
            'slick.js',
            'trustlogo.js',
            '*.custom.js',
            'chatstack.js'
        ]))
        .pipe( concat( 'scripts.js' ) )
        .pipe(minify({
            ext: {
                src: '.js',
                min: '.min.js'
            }
        }))
        .pipe( sourcemaps.write( './maps' ) )
        .pipe( gulp.dest( './dist' ) );

});

// Concat and Uglify js files for services
gulp.task( 'scripts-services', function(){

    return gulp.src([
            `${path.js}/jquery.js`,
            `${path.js}/jquery.custom.js`,
            `${path.js}/src/header/*.js`,
            `${path.js}/src/footer/*.js`
        ])
        .pipe( sourcemaps.init() )
        .pipe(order([
            'jquery.js',
            'jquery.custom.js',
        ]))
        .pipe( concat( 'scripts.js' ) )
        .pipe(minify({
            ext: {
                src: '.js',
                min: '.min.js'
            }
        }))
        .pipe( sourcemaps.write( './maps' ) )
        .pipe( gulp.dest( path.services ) );

});

// HTML minification
gulp.task( 'html', function(){

    return gulp.src( `${path.templates}/**/*.html` )
        .pipe( html({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe( gulp.dest( path.dist ) );

});

// Watch any files edition
gulp.task('watch', function () {
    gulp.watch( path.node_modules, [ 'third-party' ] );
    gulp.watch( `${path.sass}/**/*.{sass, scss}`, [ 'compile-sass', 'compile-sass-services' ] );
    gulp.watch( `${path.js}/**/*.js`, [ 'scripts' ]);
    gulp.watch( `${path.images}/**/*.*`, [ 'assets-images' ]);
    gulp.watch( `${path.fonts}/**/*.*`, [ 'assets-fonts' ]);
    gulp.watch( `${path.templates}/**/*.html`, [ 'html' ]);
    gulp.watch( `${path.pdf}/**/*.pdf`, [ 'assets-pdf' ]);
});

// Build Dist
// gulp.task('build', gulp.series( 'scripts', gulp.parallel( 'assets-images', 'compile-sass', 'third-party' ) ) );
// gulp.task('build', gulp.series( 'third-party', 'assets-images', 'compile-sass', 'scripts' ] );
// gulp.task('build', function (done) {
//     runSequence('third-party', 'assets-images', 'compile-sass', 'scripts', function () {
//         done();
//     });
// });

// Default task
gulp.task( 'default', [ 'watch' ] );