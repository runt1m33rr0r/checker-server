const gulp = require('gulp');

gulp.task('start', () => {
    return require('./server');
});

gulp.task('default', ['start']);