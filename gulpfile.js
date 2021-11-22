const { src, dest, watch, parallel, series }  = require('gulp');

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
// var runSequence = require('gulp4-run-sequence');
var zip = require('gulp-zip');
var nunjucksRender = require('gulp-nunjucks-render');

// Development Tasks 
// -----------------

// Start browserSync server
function browsersync() {
  browserSync.init({
    server : {
      baseDir: 'app/',
    },
    ghostMode: {
      clicks: false,
      scroll: false,
      forms: {
          submit: false,
          inputs: false,
          toggles: false
      }
  },
  });
}

function styles() {
  return src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass({outputStyle: 'compact' }).on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    //.pipe(sass({outputStyle: 'compressed' }).on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest('app/css')) // Outputs it in the css folder
    .pipe(browserSync.stream())
}


//nunjuks
function nunjucks()  {
  // Gets .html and .nunjucks files in pages
  return src('app/pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
      .pipe(nunjucksRender({
        path: ['app/templates']
      }))
      // output files in app folder
      .pipe(dest('app'))
}


// Watchers
function watching() {
  watch(['app/scss/**/*.scss'], styles);
  //watch(['app/pages/**/*.+(html|nunjucks)'], nunjucks);
  //watch(['app/templates/**/*.+(html|nunjucks)'], nunjucks);
  watch(['app/*.html']).on('change', browserSync.reload);
  watch(['app/js/**/*.js']).on('change', browserSync.reload);
}

// Optimization Tasks 
// ------------------


// Optimizing CSS and JavaScript 
// gulp.task('useref', function() {

//   return gulp.src('app/*.html')
//     .pipe(useref())
//     .pipe(gulpIf('*.js', uglify()))
//     .pipe(gulpIf('*.css', cleanCSS()))
//     .pipe(gulp.dest('dist'));
// });

// Optimizing Images 
// gulp.task('images', function() {
//   return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
//     // Caching img that ran through imagemin
//     .pipe(cache(imagemin({
//       interlaced: true,
//     })))
//     .pipe(gulp.dest('dist/img'))
// });

// Copying fonts 
// gulp.task('fonts', function() {
//   return gulp.src('app/fonts/**/*')
//     .pipe(gulp.dest('dist/fonts'))
// })

// Copying common js
// gulp.task('commonjs', function() {
//   return gulp.src('app/js/common.js')
//       .pipe(gulp.dest('dist/js'))
// })
// gulp.task('jqjs', function() {
//   return gulp.src('app/js/jquery.js')
//       .pipe(gulp.dest('dist/js'))
// })
// Cleaning 
// gulp.task('clean', function() {
//   return del.sync('dist').then(function(cb) {
//     return cache.clearAll(cb);
//   });
// })

// gulp.task('clean:dist', function() {
//   return del.sync(['dist/**/*', '!dist/img', '!dist/img/**/*']);
// });

// Build Sequences
// ---------------

// gulp.task('default', function(callback) {
//   runSequence(['sass', 'nunjucks', 'browserSync'], 'watch',
//     callback
//   )
// })

// gulp.task('build', function(callback) {
//   runSequence(
//     'clean:dist',
//     'sass',
//     ['useref', 'images', 'fonts', 'commonjs', 'jqjs'],
//     callback
//   )
// })

// gulp.task('archive', () =>
// gulp.src('dist/**/*')
//     .pipe(zip('archive.zip'))
//     .pipe(gulp.dest('dist'))
// )

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
// exports.images = images;
// exports.cleanDist = cleanDist;


//exports.build = series(cleanDist, images, build);
exports.default = parallel(styles ,browsersync, watching);