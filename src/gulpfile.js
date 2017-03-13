'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var path = require('path');


const TARGET_DIR = '../dist';
console.log(`    ~~ target: ${TARGET_DIR} ~~`);


/*
 * Default
 */
gulp.task('default', [
    'gf-scripts-copy',
    'gf-scripts-concat',
    'gf-libs-scripts-copy',
    'gf-libs-scripts-concat',
    'gf-sass',
    'gm-images-copy',
    'gm-misc-copy',
]);


/*
 * Watch
 */
gulp.task('watch', function () {
    gulp.watch('./sass/**/*.scss', ['gf-sass']);
    gulp.watch('./scripts/**/*', ['gf-scripts-copy']);
    gulp.watch(['./images/**/*', './icons/**/*'], ['images-copy']);
    gulp.watch('./*', ['gm-misc-copy']);
});


/*
 * Scripts
 */
gulp.task('gf-scripts-copy', function() {
    return gulp.src('./scripts/**/*', {base: '.'})
        .pipe(gulp.dest(TARGET_DIR));
});
gulp.task('gf-scripts-concat', function() {
    return gulp.src([
            './scripts/main.js',
        ])
        .pipe(concat('all-gf-app.js'))
        .pipe(gulp.dest(TARGET_DIR + '/scripts'))
        .pipe(rename('all-gf-app.min.js'))
        .pipe(uglify({
            // do not mangle variable names
            mangle: false,
            // compressor options: http://lisperator.net/uglifyjs/compress
            compress: {}
        }))
        .pipe(gulp.dest(TARGET_DIR + '/scripts'));
});
var libsScripts = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/materialize-css/dist/js/materialize.min.js',
]
gulp.task('gf-libs-scripts-copy', function() {
    return gulp.src(libsScripts)
        .pipe(gulp.dest(TARGET_DIR + '/scripts/libs'));
});
gulp.task('gf-libs-scripts-concat', function() {
    return gulp.src(libsScripts)
        .pipe(concat('all-gf-libs.js'))
        .pipe(gulp.dest(TARGET_DIR + '/scripts/libs'))
        .pipe(rename('all-gf-libs.min.js'))
        .pipe(uglify({
            // do not mangle variable names
            mangle: false,
            // compressor options: http://lisperator.net/uglifyjs/compress
            compress: {}
        }))
        .pipe(gulp.dest(TARGET_DIR + '/scripts/libs'));
});


/*
 * Styles
 */
var sass_options = {
    sourceComments: true
};
gulp.task('gf-sass', function () {
    // SASS compilation + autoprefixer
    var sassStream = gulp.src('./sass/**/*.scss')
        .pipe(sass(sass_options).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(TARGET_DIR + '/css/'));

    // additional css files
    // var cssStream = gulp.src([
    //     './node_modules/rateYo/src/jquery.rateyo.css'
    // ]);

    // concat plain css + SASS compiled
    // return merge(cssStream, sassStream)
    //     .pipe(gulp.dest(TARGET_DIR + '/css/'));
});


/*
 * Images
 */
gulp.task('gm-images-copy', function () {
    return gulp.src(
        [
            './images/**/*',
            './icons/**/*'
        ],
        {base: '.'}
    ).pipe(gulp.dest(TARGET_DIR));
});


/*
 * Misc.
 */
gulp.task('gm-misc-copy', function () {
    return gulp.src(
        [
            './sitemap.xml',
            './favicon.ico',
            './browserconfig.xml',
            './robots.txt'
        ],
        {base: '.'}
    ).pipe(gulp.dest(TARGET_DIR));
});
