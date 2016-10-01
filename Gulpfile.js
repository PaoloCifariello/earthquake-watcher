var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babel = require('babelify');

function compile() {
    var bundler = browserify('./src/js/main.js', {
        debug: true
    }).transform(babel);

    function rebundle() {
        bundler.bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./src/js/'));
    }

    rebundle();
}

gulp.task('build', function () {
    return compile();
});

gulp.task('default', ['build']);