// Paths
const path = {
    'css': './assets/css',
    'js': './assets/js',
    'fonts': './assets/fonts',
    'images': './assets/images',
    'sass': './assets/sass',
    'maps': './maps',
    'node_modules': './node_modules',
    'dist': './dist'
};

// Requirements
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const order = require('gulp-order');
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

    gulp.src( `${path.images}/**/*.*` )
        .pipe( gulp.dest( `${path.dist}/images` ));

});

// Compiling Sass files
gulp.task( 'compile-sass', function () {

    gulp.src( `${path.sass}/**/*.{sass, scss}` )
        .pipe( sourcemaps.init() )
        .pipe(sass({
            // outputStyle: 'compressed',
            precision: 8
        }))
        .on( 'error', sass.logError )
        .pipe( sourcemaps.write( path.maps ) )
        .pipe( gulp.dest( path.dist ) );

});

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

// Watch any files edition
gulp.task('watch', function () {
    gulp.watch( `${path.sass}/**/*.{sass, scss}`, [ 'compile-sass' ] );
    gulp.watch( `${path.js}/**/*.js`, [ 'scripts' ]);
    gulp.watch( `${path.images}/**/*.*`, [ 'assets-images' ]);
});

// Build Dist
gulp.task('build', [ 'third-party', 'assets-images', 'compile-sass', 'scripts' ] );

// Default task
gulp.task('default', ['watch']);