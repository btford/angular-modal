var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('scripts', function() {
  return gulp.src('modal.js').
              pipe(rename('modal.min.js')).
              pipe(uglify({
                  preserveComments: 'some',
                  outSourceMap: true
              })).
              pipe(gulp.dest('.'));
});

gulp.task('default', function() {
  gulp.start('scripts');
});
