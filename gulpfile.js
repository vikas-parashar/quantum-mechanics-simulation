/**
 * Gulp tasks for static site builds
 *
 * @copyright Copyright (c) 2016, humblemeteor.com
 * @author Michael Becker - michael@humblemeteor.com
 * @license MIT
 */

var env, production, outputDir, sources, sassStyle, browserSync, reload 	// reference vars

// production = true	//	builds out static website for production
// production = false	//	builds out static files for client hand-off
production = false

// gulp plugin vars
var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('cssnano'),
  concat = require('gulp-concat'),
  gulpif = require('gulp-if'),
  browserSync = require('browser-sync'),
  imageop = require('gulp-image-optimization'),
  uglify = require('gulp-uglify'),
  gulpif = require('gulp-if'),
  del = require('del'),
  plumber = require('gulp-plumber'),
  indexify = require('gulp-indexify'),
  fileinclude = require('gulp-file-include'),
  standard = require('gulp-standard')

// browserSync vars
browserSync = require('browser-sync').create()
reload = browserSync.reload

// autoprefix options for sass
autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
}

if (production) {
  env = 'production'
  sassStyle = 'compressed'
} else {
  env = 'development'
  sassStyle = 'expanded'
}

// set the output dir based on our environment
outputDir = 'builds/' + env + '/'

// holds all paths needed to build the project; edit as needed
sources = {
  js: ['source/assets/js/*.js'],
  html: ['source/*.html'],
  htmlIncludes: ['source/includes/*.html'],
  sass: ['source/assets/sass/*.scss'],
  images: ['source/assets/images/*.{png,gif,jpg,svg}'],
  favicons: ['source/assets/ico/**/*']
}

// browsersync task : allows automatic browser refresh on file changes
// ---------------------------------------------------------------------------------
gulp.task('serve', ['sass'], function () {
  browserSync.init({
      server: {
          baseDir: outputDir
        },
	    browser: ['firefox'],
	    notify: false
    })

    // force assets to reload
  gulp.watch(sources.js, ['js', reload])
  gulp.watch(sources.sass, ['sass', reload])
  gulp.watch(sources.images, ['images', reload])

	// force html files to reload via browsersync
  gulp.watch(sources.html.concat(sources.htmlIncludes), ['html', reload])
  gulp.watch(sources.html, [reload])
})

// js task : concat all js files and minify if env=production
// ---------------------------------------------------------------------------------
gulp.task('js', function () {
return gulp.src(sources.js)
		.pipe(gulpif(production, concat('app.js')))
		.pipe(gulpif(production, uglify()))
		// .pipe(standard())
  	// .pipe(standard.reporter('default'))
		.pipe(gulp.dest(outputDir + 'assets/js'))
})

// html task : html task processes includes, indexifies them into pretty URLs, then moves them to the builds folder
// ---------------------------------------------------------------------------------
gulp.task('html', function () {
return gulp.src(sources.html)
	    .pipe(fileinclude({
	      prefix: '@@',
	      basepath: '@file'
	    }))
	    .pipe(gulpif(production,
		    indexify({
      fileExtension: ['.html'],
      rewriteRelativeUrls: true
    }))
		)
		.pipe(gulp.dest(outputDir))
})

// sass task : basic sass compiling task
// ---------------------------------------------------------------------------------
gulp.task('sass', function () {
  return gulp.src(sources.sass)
		.pipe(plumber(function (error) {
  gutil.beep()
  gutil.log(gutil.colors.red(error.message))
  this.emit('end')
}))
		.pipe(sourcemaps.init())
		.pipe(sass({
  outputStyle: sassStyle
}).on('error', sass.logError))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(outputDir + 'assets/css'))
		.pipe(browserSync.stream())
})

// favicons task : basic favicons task, move them to build dir
// ---------------------------------------------------------------------------------
gulp.task('favicons', function () {
return gulp.src(sources.favicons)
		.pipe(gulp.dest(outputDir + 'assets/ico'))
})

// images task : optimize images and move them to build dir
// ---------------------------------------------------------------------------------
gulp.task('images', function () {
  return gulp.src(sources.images)
		.pipe(imageop({
  optimizationLevel: 5,
  progressive: true,
  interlaced: true
}))
		.pipe(gulp.dest(outputDir + 'assets/images'))
})

// clean task : empties build folder for a fresh start each time the project spins up
// ---------------------------------------------------------------------------------
gulp.task('clean:builds', function (cb) {
  return del(['builds'], cb)
})

// build task : builds project w/o browsersync server
// ---------------------------------------------------------------------------------
gulp.task('build', ['clean:builds'], function () {
  // Default build task runs w/o browsersync or watch
  gulp.start('js', 'sass', 'favicons', 'images', 'html')
})

gulp.task('default', ['clean:builds'], function () {
  // Default task to run for local dev
  gulp.start('js', 'sass', 'favicons', 'images', 'html', 'serve')
})

