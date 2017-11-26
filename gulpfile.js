const gulp = require('gulp');

gulp.task('start', () => require('./server'));

gulp.task('default', ['start']);
