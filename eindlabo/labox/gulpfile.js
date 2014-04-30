var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');

gulp.task('styles', function (){
	gulp.src('public/stylesheets/*.css')
    .pipe(concatCss('build.css'))
    .pipe(minifyCss(opts))
    .pipe(livereload())
    .pipe(gulp.dest('public/build/css/'))
});

gulp.task('scripts', function() {
  gulp.src('public/javascripts/script.js')
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(livereload())
    .pipe(gulp.dest('public/build/js/'));
});



gulp.task('sass', function () {
    gulp.src('public/sass/stylesheets/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('watch', function (){
	gulp.watch('public/stylesheets/*.css', ['styles']);
  	gulp.watch('public/sass/stylesheets/*.scss', ['sass']);
  	gulp.watch('public/javascripts/*.js', ['scripts']);
});

gulp.task('develop', function () {
  nodemon({ script: 'app.js', ext: 'jade js', ignore: ['ignored.js'] })
    /*.on('change', ['lint'])*/
    .on('restart', function () {
      console.log('restarted!')
    })
})

gulp.task('default', ['scripts', 'styles', 'sass', 'watch', 'develop']);