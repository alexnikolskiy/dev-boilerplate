require('dotenv').config();
const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const paths = require('./paths.js');
const { sass, html, js } = require('./build');

function watch() {
  gulp
    .watch('**/*.scss', { cwd: paths.src.sass }, gulp.series(sass))
    .on('change', browserSync.reload);
  gulp
    .watch('**/*.html', { cwd: paths.src.html }, gulp.series(html))
    .on('change', browserSync.reload);
  gulp
    .watch(
      ['**/*.js', '!**/__tests__/*.js', '!**/__mocks__/*.js'],
      { cwd: paths.src.js },
      gulp.series(js),
    )
    .on('change', browserSync.reload);
}

function serve() {
  const isProxy = !!+process.env.HTTP_PROXY;

  browserSync.init({
    port: process.env.HTTP_DEV_PORT,
    server: !isProxy && `${paths.dest.root}`,
    proxy: isProxy && `${process.env.HTTP_HOST}:${process.env.HTTP_PORT}`,
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });
}

module.exports = {
  watch,
  serve,
};
