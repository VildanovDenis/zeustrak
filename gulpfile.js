var gulp      = require('gulp'), 
    less = require('gulp-less'),
    path = require('path');
    browserSync = require('browser-sync'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    del         = require('del'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs');
    imagemin    = require('gulp-imagemin'), 
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache');

gulp.task('less', function(){ 
    return gulp.src('app/less/**/index.less') 
        .pipe(less()) 
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('app/css')) 
        .pipe(browserSync.reload({stream: true})) 
});

gulp.task('css-libs', ['less'], function() {
    return gulp.src('app/css/index.css') 
        .pipe(cssnano()) 
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css')); 
});

gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'app' 
        },
        notify: false 
    });
});

gulp.task('scripts', function() {
    return gulp.src('app/js/index.js')
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/js'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
  gulp.watch('app/less/**/*.less', ['less']); 
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});

gulp.task('clean', function() {
    return del.sync('dist'); 
});

// gulp.task('img', function() {
//     return gulp.src('app/img/**/*') 
//         .pipe(cache(imagemin({  
//             interlaced: true,
//             progressive: true,
//             svgoPlugins: [{removeViewBox: false}],
//             use: [pngquant()]
//         })))
//         .pipe(gulp.dest('dist/img')); 
// });

gulp.task('build', ['clean', 'less', 'scripts'], function() { //добавить 'img' если нужно будет

    var buildCss = gulp.src([ 
        'app/css/index.css',
        'app/css/index.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') 
    .pipe(gulp.dest('dist/fonts'))

    var buildVideo = gulp.src('app/video/**/*') 
    .pipe(gulp.dest('dist/video'))

    var buildJs = gulp.src('app/js/**/*') 
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') 
    .pipe(gulp.dest('dist'));

});