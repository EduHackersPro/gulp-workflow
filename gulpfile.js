// Для установки всех зависимостей в директории проекта можно выполнить
// npm i
// либо вручную поставить все пакеты:
// npm i -D gulp gulp-pug del gulp-sass gulp-concat gulp-postcss autoprefixer browser-sync node-normalize-scss
const gulp = require('gulp') // сам gulp
const pug = require('gulp-pug') // обработчик pug -> html
const del = require('del') // для удаления папок

const scss = require('gulp-sass') // обработчик scss -> css
const concat = require('gulp-concat') // склейка файлов в один
const postcss = require('gulp-postcss') // обработка css
const autoprefixer = require('autoprefixer') // плагин для обработки css

const browserSync = require('browser-sync').create() // экземпляр веб сервера

/**
 * Очистка папки с результатом работы автосборщика
 */
function clean(done) {
  del(['dev'])
  done()
}

/**
 * Сборка HTML файлов
 */
function html(done) {
  gulp.src([
      'src/pages/*.pug',
    ])
    .pipe(pug())
    .pipe(gulp.dest('dev'))
  done()
}

/**
 * Сборка CSS проектов
 */
function css(done) {
  // плагины для PostCSS
  const plugins = [
    autoprefixer({browsers: ['last 2 versions']}),
  ]

  gulp.src([
      'src/styles/*.scss',
      'src/styles/components/**/*.scss',
    ])
    .pipe(scss({
      includePaths: require('node-normalize-scss').includePaths // normalize.css для кроссбраузерной верстки
    }))
    .pipe(concat('styles.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dev'))
  done()
}

/**
 * Обновление браузера после обработки
 */
function live(done) {
  browserSync.reload()
  done()
}

/**
 * Запуск веб сервера из папки
 */
function serve(done) {
  browserSync.init({
    server: {
      baseDir: './dev/'
    }
  })
  done()
}

/**
 * Запуск наблюдателя за изменениями в файлах
 */
gulp.watch('src/**/*.pug', gulp.series(html, live))
gulp.watch('src/**/*.scss', gulp.series(css, live))

/**
 * Экспорт задач gulp
 */
exports.html = html
exports.css = css
exports.default = gulp.series(clean, gulp.parallel(html, css, serve))
