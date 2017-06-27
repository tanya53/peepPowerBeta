var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass',function() {
  //return gulp.src('scss/*.scss')
  return gulp.src('public/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('public/style/'));
});
gulp.task('watch',function(){
gulp.watch('public/scss/*.scss',['sass']);
});
gulp.task('default',['sass','watch']);
