const gulp = require('gulp');
const { clean, sass, sprite, images, webp, copy, js } = require('./gulp/build');
const { watch, serve } = require('./gulp/watch');

gulp.task(
  'default',
  gulp.series(clean, gulp.parallel(sass, gulp.series(images, sprite, js, copy))),
);

gulp.task('build', gulp.series('default'));

gulp.task('dev', gulp.series('default', serve, watch));

gulp.task('webp', webp);
