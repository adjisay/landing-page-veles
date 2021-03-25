const { src, dest, parallel, series, watch } = require('gulp');
const sass 				 = require('gulp-sass');
const notify 			 = require('gulp-notify');
const rename 			 = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleancss 		 = require('gulp-clean-css');
const htmlmin      = require('gulp-htmlmin');
const sourcemaps   = require('gulp-sourcemaps');
const browsersync  = require('browser-sync').create();
const imagemin     = require('gulp-imagemin');
const webp         = require('gulp-webp');
const webphtml     = require('gulp-webp-html');
const webpcss      = require('gulp-webp-css');
const svgsprite    = require('gulp-svg-sprite');
const ttf2woff     = require('gulp-ttf2woff');
const ttf2woff2    = require('gulp-ttf2woff2');
const fs 					 = require('fs');
const del 				 = require('del');
const webpack 		 = require('webpack-stream');

const html = () => {
  return src('./app/index.html')
	.pipe(webphtml())
  .pipe(dest('./dist/'))
  .pipe(browsersync.stream());
};

const htmlBuild = () => {
  return src('./app/*.html')
	.pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(dest('./dist/'));
};

const styles = () => {
  return src('./app/scss/**/*.scss')
  .pipe(sourcemaps.init()) 
  .pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
  .pipe(rename({ suffix: '.min' }))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 5 versions'],
    cascade: true
  }))
	.pipe(webpcss())
  .pipe(cleancss())
  .pipe(sourcemaps.write('.'))
  .pipe(dest('./dist/css/'))
  .pipe(browsersync.stream());
};

const stylesBuild = () => {
  return src('./app/scss/**/*.scss')
  .pipe(sass({ outputStyle: 'expanded' }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 5 versions'],
    cascade: true
  }))
	.pipe(webpcss())
  .pipe(cleancss())
  .pipe(dest('./dist/css/'));
};

const images = () => {
  return src('./app/images/**/*', {dot: true, ignore: './app/images/svg/*'})
	.pipe(
		webp({
			quality: 70
		})
	)
	.pipe(dest('./dist/images'))
	.pipe(src('./app/images/**/*', {dot: true, ignore: './app/images/svg/*'}))
  .pipe(
    imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      interlaced: false,
      optimizationLevel: 3
    })
  )
  .pipe(dest('./dist/images'));
};

const svgSprites = () => {
	return src('./app/images/svg/*.svg')
		.pipe(svgsprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
					// example: true
				}
			}
		}))
		.pipe(dest('./dist/images/svg'));
};

const fonts = () => {
	src('./app/fonts/**.ttf')
		.pipe(ttf2woff())
		.pipe(dest('./dist/fonts/'));
	return src('./app/fonts/**.ttf')
		.pipe(ttf2woff2())
		.pipe(dest('./dist/fonts/'));
};

const cb = () => {};

let srcFonts = './app/scss/_fonts.scss';
let distFonts = './dist/fonts/';

const fontsStyle = (done) => {
	let fileContent = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(distFonts, function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				if (c_fontname != fontname) {
					fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
				}
				c_fontname = fontname;
			}
		}
	});

	done();
};

const clean = () => {
  return del(['dist/*']);
};

const scripts = () => {
	return src('./app/js/main.js')
		.pipe(webpack({
			mode: 'production',
			output: {
				filename: 'main.js',
			},
      devtool: 'source-map',
			module: {
				rules: [{
					test: /\.m?js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [['@babel/preset-env', {
                debug: true,
                corejs: 3,
                useBuiltIns: "usage"
            }]]
						}
					}
				}]
			},
		}))
		.pipe(dest('./dist/js'))
		.pipe(browsersync.stream());
};

const scriptsBuild = () => {
	return src('./app/js/main.js')
		.pipe(webpack({
			mode: 'production',
			output: {
				filename: 'main.js',
			},
			module: {
				rules: [{
					test: /\.m?js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [['@babel/preset-env', {
                debug: true,
                corejs: 3,
                useBuiltIns: "usage"
            }]]
						}
					}
				}]
			},
		}))
		.pipe(dest('./dist/js'));
};

const watchFiles = () => {
	browsersync.init({
		server: {
			baseDir: './dist'
		},
    port: 3000,
    notify: false
	});

	watch('./app/index.html', html);
	watch('./app/scss/**/*.scss', styles);
  watch('./app/images/**/*.', images);
  watch('./app/images/svg/*.svg', svgSprites);
  watch('./app/fonts/**.ttf', fonts);
  watch('./app/fonts/**.ttf', fontsStyle);
  watch('./app/js/**/*.js', scripts);

};

exports.styles = styles;
exports.html = html;
exports.htmlBuild = htmlBuild;
exports.images = images;
exports.svgSprites = svgSprites;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.watchFiles = watchFiles;
exports.clean = clean;

// development
exports.default = series(clean, parallel(html, scripts, images, fonts, svgSprites), styles, watchFiles);

// production
exports.build = series(clean, parallel(htmlBuild, scriptsBuild, fonts, images, svgSprites), stylesBuild);