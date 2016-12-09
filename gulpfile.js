/**
 * Created by Me1kro on 16/10/18.
 */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),//js压缩,美化
    concat = require('gulp-concat')//js合并


// 合并、压缩js文件
gulp.task('js', function () {
    return gulp.src([
        'src/js/jquery-1.11.1.min.js',
        'src/js/extendPagination.js'
    ])
        .pipe(concat('version.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
})


gulp.task('default', ['js'], function () {

});
