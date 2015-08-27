var gulp = require('gulp'),
	$    = require('gulp-load-plugins')();

gulp.task('scss', function() {
	return gulp.src('./src/scss/style.scss')
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.minifyCss())
    	.pipe(gulp.dest('./dist/css'))
		.pipe($.livereload());
});

gulp.task('html', function() {
	return gulp.src('./dist/**/*.html')
		.pipe($.livereload());
});

gulp.task('watch', ['webserver'], function () {
    $.livereload.listen();
    gulp.watch('./src/scss/**/*.scss', ['scss']);
	gulp.watch('./src/scripts/**/*.js', ['scripts']);
	gulp.watch('./dist/**/*.html', ['html']);
});

gulp.task('scripts', function () {
	return gulp.src(['./src/scripts/map.js',
					'./src/jsx/info.jsx',
					'./src/scripts/boot.js'])
			.pipe($.sourcemaps.init())
			.pipe($.concat('map.js'))
			.pipe($.react())
			.pipe($.babel())
			.pipe($.uglify())
			.pipe($.sourcemaps.write())
			.pipe(gulp.dest('./dist/scripts'))
			.pipe($.livereload());
});

gulp.task('resource', function () {
	return gulp.src(['./src/resource/world.js',
					'./src/resource/services.js'])
			.pipe($.concat('resource.min.js'))
			.pipe($.uglify({
				mangle: false
			}))
			.pipe(gulp.dest('./dist/scripts'))
			.pipe($.livereload());
});

gulp.task('jsx', function() {
	return gulp.src('./src/jsx/*.jsx')
			.pipe($.react())
			.pipe(gulp.dest('./src/scripts'));
});

gulp.task('webserver', function () {
    $.connect.server({
        port: 8888,
        root: 'dist',
        host: 'razord.dev',
        livereload: true
    });
});

gulp.task('default', ['watch']);
