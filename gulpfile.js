const gulp = require('gulp');

const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg  = require('imagemin-mozjpeg');
const pug = require('gulp-pug');
const browserSync = require('browser-sync');
const notify = require('gulp-notify');

gulp.task('css', () => {
  return gulp.src('./src/css/style.scss')
    .pipe(sass({
      outputStyle: 'expanded'
      }))
    .pipe(gulp.dest('./dest'))
    .pipe(notify({
      title: 'sass compiled!',
      message: 'scssファイルが更新されました！'
      }));
  });

gulp.task('img', () => {
  gulp.src('./src/img/*')
    .pipe(imagemin([
      pngquant({ quality: '65-80', speed: 1 }),
      mozjpeg({ quality: 80 })
    ]))
    .pipe(gulp.dest('./dest/img'));
  });

gulp.task('html', () => {
  return gulp.src(['./src/**/*.pug', '!./src/**/_*.pug'])
    .pipe(pug({
      pretty: true
      }))
    .pipe(gulp.dest('./dest'))
  });

gulp.task("browserSync", ["css", "html"], () => {
  browserSync({
    server: {
      /* rootとなるディレクトリを指定 */
      baseDir: "./dest"
    }
    });
  gulp.watch("src/**/**", () => {
    browserSync.reload();
    });
  });



/* pugファイルとscssファイルに変更があったらhtmlとcssのタスクを実行 */
gulp.task('watch', () => {
  gulp.watch('./src/**/*.pug', ['html']),
  gulp.watch('./src/css/style.scss', ['css'])
  })


gulp.task('default', ['browserSync', 'watch']);
