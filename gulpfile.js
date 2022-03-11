const modules = {
	fs: require('fs'),
	del: require('del'),
	gulp: require('gulp'),
	gulpAutoprefixer: require('gulp-autoprefixer'),
	gulpCheerio: require('gulp-cheerio'),
	gulpCleanCss: require('gulp-clean-css'),
	gulpFileInclude: require('gulp-file-include'),
	gulpFonter: require('gulp-fonter'),
	gulpGroupCssMediaQueries: require('gulp-group-css-media-queries'),
	gulpImageMin: require('gulp-imagemin'),
	gulpRename: require('gulp-rename'),
	gulpReplace: require('gulp-replace'),
	gulpSass: require('gulp-sass'),
	gulpSvgSprite: require('gulp-svg-sprite'),
	gulpSvgMin: require('gulp-svgmin'),
	gulpTtf2Woff: require('gulp-ttf2woff'),
	gulpTtf2Woff2: require('gulp-ttf2woff2'),
	gulpUglifyEs: require('gulp-uglify-es').default
}

const {
	src,
	dest,
	series,
	parallel,
	watch
} = modules.gulp

const sources = 'sources'
const public = 'public'

const paths = {
	sources: {
		scss: {
			style: sources + '/scss/style.scss',
			views: sources + '/scss/views/**/*.scss'
		},
		js: {
			script: sources + '/js/script.js',
			views: sources + '/js/views/**/*.js'
		},
		img: {
			articles: sources + '/img/articles/*.{jpg, jpeg, png, webp}',
			users: sources + '/img/users/*.{jpg, jpeg, png, webp}'
		},
		icons: sources + '/icons/*.svg',
		fonts: {
			ttf: sources + '/fonts/**/*.ttf',
			otf: sources + '/fonts/**/*.otf'
		}
	},
	public: {
		css: {
			style: public + '/css/',
			views: public + '/css/views/'
		},
		js: {
			script: public + '/js/',
			views: public + '/js/views/'
		},
		img: {
			articles: public + '/img/articles/',
			users: public + '/img/users/'
		},
		icons: public + '/icons/',
		fonts: public + '/fonts/'
	},
	watch: {
		scss: {
			style: sources + '/scss/**/*.scss',
			views: sources + '/scss/views/**/*.scss'
		},
		js: {
			script: sources + '/js/**/*.js',
			views: sources + '/js/views/**/*.js'
		},
		img: {
			articles: sources + '/img/articles/**/*.{jpg, jpeg, png, webp}',
			users: sources + '/img/users/**/*.{jpg, jpeg, png, webp}'
		}
	},
	clean: './' + public + '/'
}

function cssStyle() {
	return src(paths.sources.scss.style)
		.pipe(
			modules
			.gulpSass({
				outputStyle: 'expanded'
			})
			.on('error', modules.gulpSass.logError)
		)
		.pipe(modules.gulpGroupCssMediaQueries())
		.pipe(
			modules.gulpAutoprefixer({
				overrideBrowserslist: ['last 5 versions'],
				cascade: true
			})
		)
		.pipe(dest(paths.public.css.style))
		.pipe(modules.gulpCleanCss(), (details) => {
			console.log(`${details.name}: ${details.stats.originalSize}`)
			console.log(`${details.name}: ${details.stats.minifiedSize}`)
		})
		.pipe(
			modules.gulpRename({
				suffix: '.min'
			})
		)
		.pipe(dest(paths.public.css.style))
}

function cssViews() {
	return src(paths.sources.scss.views)
		.pipe(
			modules
			.gulpSass({
				outputStyle: 'expanded'
			})
			.on('error', modules.gulpSass.logError)
		)
		.pipe(modules.gulpGroupCssMediaQueries())
		.pipe(
			modules.gulpAutoprefixer({
				overrideBrowserslist: ['last 5 versions'],
				cascade: true
			})
		)
		.pipe(dest(paths.public.css.views))
		.pipe(modules.gulpCleanCss(), (details) => {
			console.log(`${details.name}: ${details.stats.originalSize}`)
			console.log(`${details.name}: ${details.stats.minifiedSize}`)
		})
		.pipe(
			modules.gulpRename({
				suffix: '.min'
			})
		)
		.pipe(dest(paths.public.css.views))
}

function jsScript() {
	return src(paths.sources.js.script)
		.pipe(modules.gulpFileInclude())
		.pipe(dest(paths.public.js.script))
		.pipe(modules.gulpUglifyEs())
		.pipe(modules.gulpRename({
			suffix: '.min'
		}))
		.pipe(dest(paths.public.js.script))
}

function jsViews() {
	return src(paths.sources.js.views)
		.pipe(modules.gulpFileInclude())
		.pipe(dest(paths.public.js.views))
		.pipe(modules.gulpUglifyEs())
		.pipe(modules.gulpRename({
			suffix: '.min'
		}))
		.pipe(dest(paths.public.js.views))
}

function imgArticles() {
	return src(paths.sources.img.articles)
		.pipe(modules.gulpImageMin({
			progressive: true,
			svgoPlugins: [{
				removeViewbox: false
			}],
			interlaced: true,
			optimizationLevel: 3
		}))
		.pipe(dest(paths.public.img.articles))
}

function imgUsers() {
	return src(paths.sources.img.users)
		.pipe(modules.gulpImageMin({
			progressive: true,
			svgoPlugins: [{
				removeViewbox: false
			}],
			interlaced: true,
			optimizationLevel: 3
		}))
		.pipe(dest(paths.public.img.users))
}

function sprite() {
	return src(paths.sources.icons)
		.pipe(modules.gulpSvgMin({
			svg2js: {
				pretty: true
			}
		}))
		.pipe(modules.gulpCheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill')
				$('[stroke]').removeAttr('stroke')
				$('[style]').removeAttr('style')
			},
			parserOptions: {
				xmlMode: true
			}
		}))
		.pipe(modules.gulpReplace('&gt;', '>'))
		.pipe(modules.gulpSvgSprite({
			mode: {
				stack: {
					sprite: '../icons.svg'
				}
			}
		}))
		.pipe(dest(paths.public.icons))
}

function fonts() {
	src(paths.sources.fonts.ttf)
		.pipe(modules.gulpTtf2Woff())
		.pipe(dest(paths.public.fonts))
	return src(paths.sources.fonts.ttf)
		.pipe(modules.gulpTtf2Woff2())
		.pipe(dest(paths.public.fonts))
}

function otf2ttf() {
	return src(paths.sources.fonts.otf)
		.pipe(modules.gulpFonter({
			formats: ['ttf']
		}))
		.pipe(dest(paths.sources.fonts))
}

function fontStyle() {
	const file_content = modules.fs.readFileSync(sources + '/scss/fonts.scss');
	if (file_content == '') {
		modules.fs.writeFile(sources + '/scss/fonts.scss', '', cb);
		return modules.fs.readdir(paths.public.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						modules.fs.appendFile(sources + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}

function cb() {}

function watchFiles() {
	watch([paths.watch.scss.style], cssStyle)
	watch([paths.watch.scss.views], cssViews)
	watch([paths.watch.js.script], jsScript)
	watch([paths.watch.js.views], jsViews)
	watch([paths.watch.img.articles], imgArticles)
	watch([paths.watch.img.users], imgUsers)
}

function clean() {
	return modules.del(paths.clean)
}

const build = series(clean, parallel(cssStyle, cssViews, jsScript, jsViews, imgArticles, imgUsers, fonts), fontStyle)
const def = parallel(build, watchFiles)

exports.otf2ttf = otf2ttf
exports.svg = sprite
exports.default = def