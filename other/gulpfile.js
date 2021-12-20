const gulp = require('gulp');
const uglify = require('gulp-uglify');


gulp.task('uglify-js',() => {
    return gulp.src('/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
})