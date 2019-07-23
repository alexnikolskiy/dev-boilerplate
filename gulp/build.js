const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({ lazy: true });
const del = require('del');
const normalize = require('node-normalize-scss');
const autoprefixer = require('autoprefixer');
const sorting = require('postcss-sorting');
const webpConvert = require('imagemin-webp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const paths = require('./paths');

const isDevelopment = process.env.NODE_ENV === 'development';

const webpackConfig = isDevelopment ? require('../webpack.dev') : require('../webpack.prod');

function clean() {
  return del('build');
}

function sass() {
  return gulp
    .src(`${paths.src.sass}style.scss`)
    .pipe(plugins.plumber())
    .pipe(plugins.sassGlob())
    .pipe(plugins.if(isDevelopment, plugins.sourcemaps.init()))
    .pipe(
      plugins.sass({
        includePaths: normalize.includePaths,
      }),
    )
    .pipe(plugins.postcss([autoprefixer(), sorting({ 'properties-order': 'alphabetical' })]))
    .pipe(plugins.cleanCss())
    .pipe(
      plugins.if(
        isDevelopment,
        plugins.sourcemaps.write({ sourceRoot: '/_map/css', includeContent: true }),
      ),
    )
    .pipe(gulp.dest(paths.dest.css));
}

function images() {
  return gulp
    .src([`${paths.src.img}**/*.{png,jpg,svg}`])
    .pipe(
      plugins.imagemin([
        plugins.imagemin.optipng({ optimizationLevel: 3 }),
        plugins.imagemin.jpegtran({ progressive: true }),
        plugins.imagemin.svgo(),
      ]),
    )
    .pipe(gulp.dest(file => file.base));
}

function webp() {
  return gulp
    .src(`${paths.src.img}**/*.{png,jpg,jpeg}`)
    .pipe(plugins.imagemin([webpConvert({ quality: 80 })]))
    .pipe(plugins.extReplace('.webp'))
    .pipe(gulp.dest(file => file.base));
}

function sprite() {
  return gulp
    .src(`${paths.src.img}**/*.svg`)
    .pipe(
      plugins.svgstore({
        inlineSvg: true,
      }),
    )
    .pipe(plugins.rename('sprite.svg'))
    .pipe(gulp.dest(paths.dest.img));
}

function copy() {
  return gulp
    .src([`${paths.src.img}**/*.{png,jpg,jpeg,webp}`, `${paths.src.fonts}**/*.{woff,woff2}`], {
      base: paths.src.root,
    })
    .pipe(gulp.dest(paths.dest.root));
}

function js() {
  return gulp
    .src(`${paths.src.js}*.js`)
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(paths.dest.js));
}

module.exports = {
  clean,
  sass,
  sprite,
  images,
  webp,
  copy,
  js,
};
