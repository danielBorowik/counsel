const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const changed = require('gulp-changed');
const htmlReplace = require('gulp-html-replace');
const htmlMin = require('gulp-htmlmin');
const del = require('del');
const babel = require('gulp-babel');

const config = {
    dist: 'dist/',
    src: 'src/',
    cssin: 'src/css/**/*.css',
    jsin: 'src/js/**/*.js',
    jsconcat: 'src/js/',
    jsminifyin: 'src/js/index.js',
    imgfolder: 'src/img/*',
    imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
    htmlin: 'src/*.html',
    scssin: 'src/scss/**/*.scss',
    cssout: 'dist/css/',
    jsout: 'dist/js/',
    imgout: 'dist/img/',
    htmlout: 'dist/',
    scssout: 'src/css/',
    cssoutname: 'style.css',
    jsoutname: 'index.js',
    cssreplaceout: 'css/style.css',
    jsreplaceout: 'js/index.js',
};

function convertCSS() {
    return gulp
        .src(config.cssin)
        .pipe(concat(config.cssoutname))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.cssout));
}

function convertSCSS() {
    return gulp
        .src(config.scssin)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.scssout))
        .pipe(browserSync.stream());
}

function copyHtml() {
    return gulp
        .src(config.htmlin)
        .pipe(
            htmlReplace({
                css: config.cssreplaceout,
                js: config.jsreplaceout,
            })
        )
        .pipe(
            htmlMin({
                sortAttributes: true,
                sortClassName: true,
                collapseWhitespace: true,
            })
        )
        .pipe(gulp.dest('dist/'));
}

function js() {
    return gulp
        .src(config.jsin)
        .pipe(concat(config.jsoutname))
        .pipe(babel())
        .on('error', function(err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(uglify())
        .on('error', function(err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(gulp.dest(config.jsout));
}

function imageMin() {
    return gulp
        .src(config.imgin)
        .pipe(changed(config.imgout))
        .pipe(imagemin())
        .pipe(gulp.dest(config.imgout));
}

function clean() {
    return del(config.dist);
}

function watch() {
    browserSync.init({
        server: {
            baseDir: config.src,
        },
    });

    gulp.watch(config.scssin, gulp.series(convertSCSS, convertCSS));
    gulp.watch(config.imgfolder, imageMin);
    gulp.watch(config.htmlin).on(
        'change',
        gulp.series(copyHtml, browserSync.reload)
    );
    gulp.watch(config.jsin).on('change', gulp.series(js, browserSync.reload));
}

exports.convertSCSS = convertSCSS;
exports.copyHtml = copyHtml;
exports.imageMin = imageMin;
exports.js = js;
exports.watch = watch;
exports.convertCSS = convertCSS;
exports.htmlReplace = htmlReplace;
exports.htmlMin = htmlMin;
exports.clean = clean;
exports.config = config;

const defaultTasks = gulp.series(
    clean,
    copyHtml,
    js,
    convertSCSS,
    convertCSS,
    imageMin
);
exports.default = defaultTasks;
