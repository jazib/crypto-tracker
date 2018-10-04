// requirements

var gulp = require('gulp');
var gulpBrowser = require("gulp-browser");
var gulRename = require('gulp-rename');
var del = require('del');
var size = require('gulp-size');


// tasks

gulp.task('transform', function () {
    var stream = gulp.src('./project/static/scripts/jsx/*.jsx')
        .pipe(gulpBrowser.browserify({transform: ['reactify']}))
        .pipe(gulRename('main.js'))
        .pipe(gulp.dest('./project/static/scripts/js/'))
        .pipe(size());
    return stream;
});

gulp.task('del', function () {
    return del(['./project/static/scripts/js']);
});

gulp.task('default', ['del'], function () {
    gulp.start('transform');
    gulp.watch('./project/static/scripts/jsx/*.jsx', ['transform']);
});