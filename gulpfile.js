const gulp = require('gulp');

const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg  = require('imagemin-mozjpeg');
const pug = require('gulp-pug');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

gulp.task('css', () => {
  return gulp.src('./src/css/style.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded'
      }))
    .pipe(gulp.dest('./dist'))
  });

gulp.task('img', () => {
  gulp.src('./src/img/*')
    .pipe(imagemin([
      pngquant({ quality: '65-80', speed: 1 }),
      mozjpeg({ quality: 80 })
    ]))
    .pipe(gulp.dest('./dist/img'));
  });

gulp.task('html', () => {
  return gulp.src(['./src/**/*.pug', '!./src/**/_*.pug'])
    .pipe(plumber())
    .pipe(pug({
      pretty: true
      }))
    .pipe(gulp.dest('./dist'))
  });

gulp.task("browserSync", ["css", "html", "js"], () => {
  browserSync({
    server: {
      /* rootとなるディレクトリを指定 */
      baseDir: "./dist"
    }
    });
  gulp.watch("src/**/**", () => {
    browserSync.reload();
    });
  });

gulp.task('js', () => {
  browserify({
    entries: ['./src/js/app.js']
  })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('dist/js'));
})

/* pugファイルとscssファイルに変更があったらhtmlとcssのタスクを実行 */
gulp.task('watch', () => {
  gulp.watch('./src/**/*.pug', ['html']),
  gulp.watch('./src/css/style.scss', ['css']),
  gulp.watch('./src/js/**/*.js');
  })


gulp.task('default', ['browserSync', 'watch']);
