const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const through = require('through2')
const px2rpx = require('./lib/px2rpx.cjs')

// 定义编译 SCSS 任务
gulp.task('sass', function () {
  return gulp
    .src('src/style.scss') // 输入的 SCSS 文件路径
    .pipe(sass()) // 编译 SCSS
    .pipe(gulp.dest('dist')) // 输出的 CSS 文件路径
})

gulp.task('sass:mp', function () {
  return gulp
    .src('src/style.scss') // 输入的 SCSS 文件路径
    .pipe(sass()) // 编译 SCSS
    .pipe(postcss([px2rpx()])) // 使用 PostCSS 处理生成的 CSS
    .pipe(gulp.dest('dist/mp')) // 输出的 CSS 文件路径
})

function wrapCSS(prefix) {
  function transform(file, encoding, callback) {
    if (file.isStream()) {
      this.emit('error', new Error('Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      file.contents = Buffer.concat([Buffer.from(`:where(.${prefix}) {\n`), file.contents, Buffer.from(`\n}`)])
    }

    this.push(file)
    callback()
  }

  return through.obj(transform)
}

gulp.task('sass:prefix-px', function() {
  return gulp.src('src/style.scss').pipe(sass()).pipe(wrapCSS('dangoui-prefix-px')).pipe(sass()).pipe(gulp.dest('dist/prefix/px'))
})

gulp.task('sass:prefix-rpx', function() {
  return gulp.src('src/style.scss').pipe(sass()).pipe(wrapCSS('dangoui-prefix-rpx')).pipe(sass()).pipe(postcss([px2rpx()])).pipe(gulp.dest('dist/prefix/rpx'))
})

// 定义默认任务
gulp.task('default', gulp.series(['sass', 'sass:mp', 'sass:prefix-px', 'sass:prefix-rpx']))
