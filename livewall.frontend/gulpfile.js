'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var babelify = require("babelify");
var plumber = require('gulp-plumber');
var less = require('gulp-less');

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('.'))
        .use(connect.directory('.'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect'], function () {
    require('opn')('http://localhost:9000');
});

gulp.task('less', function () {
  return gulp.src('app/styles/main.less')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(less())
    .pipe(plumber.stop())
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('js', function () {
    return gulp.src(['app/scripts/**/*.js', 'app/scripts/*.js'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({ modules: 'amd' }))
        // .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('./dist/scripts'));
});


gulp.task('watch', ['js', 'less', 'connect', 'serve'], function () {
    var server = $.livereload();

    gulp.watch('app/scripts/**/*.js', ['js']);
    gulp.watch('app/styles/**/*.less', ['less']);

    gulp.watch([
        'app/*.html',
        './dist/styles/*.css',
        './dist/scripts/**/*.js',
        './dist/scripts/*.js'
    ]).on('change', function (file) {
        server.changed(file.path);
    });
});
