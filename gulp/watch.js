require('dotenv').config();
const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const paths = require('./paths.js');
const { sass, js } = require('./build');

function reload(done) {
  browserSync.reload();
  done();
}

function watch() {
  const usePolling = JSON.parse(process.env.USE_POLLING);

  gulp.watch('**/*.scss', { cwd: paths.src.sass, usePolling }, gulp.series(sass, reload));
  gulp.watch('**/*.html', { cwd: paths.src.html, usePolling }, gulp.series(js, reload));
  gulp.watch(
    ['**/*.js', '!**/__tests__/*.js', '!**/__mocks__/*.js'],
    { cwd: paths.src.js, usePolling },
    gulp.series(js, reload),
  );
}

function serve(done) {
  const isProxy = JSON.parse(process.env.HTTP_PROXY);

  browserSync.init({
    port: process.env.HTTP_DEV_PORT,
    server: !isProxy && `${paths.dest.root}`,
    proxy: isProxy && `${process.env.HTTP_HOST}:${process.env.HTTP_PORT}`,
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  done();
}

module.exports = {
  watch,
  serve,
};
