const gulp = require('gulp');
const { clean, sass, html, sprite, images, webp, copy, js } = require('./gulp/build');
const { watch, serve } = require('./gulp/watch');

gulp.task(
  'default',
  gulp.series(clean, gulp.parallel(sass, gulp.series(images, sprite, html, js, copy))),
);

gulp.task('build', gulp.series('default'));

gulp.task('dev', gulp.series('default', gulp.parallel(watch, serve)));

gulp.task('webp', gulp.series(webp));
