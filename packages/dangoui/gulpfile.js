const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
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

// 定义默认任务
gulp.task('default', gulp.series(['sass', 'sass:mp']))
