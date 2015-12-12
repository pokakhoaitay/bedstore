/*
 ---------------------
 | This file is customed by me base on this: https://gist.github.com/DESIGNfromWITHIN/11383339
 ---------------------

 Gulpfile.js file for the tutorial:
 Using Gulp, SASS and Browser-Sync for your front end web development - DESIGNfromWITHIN
 http://designfromwithin.com/blog/gulp-sass-browser-sync-front-end-dev
 Steps:
 1. Install gulp globally:
 npm install --global gulp
 2. Type the following after navigating in your project folder:
 npm install gulp gulp-util gulp-sass gulp-uglify gulp-rename gulp-minify-css gulp-notify gulp-concat gulp-plumber browser-sync gulp-if gulp-typescript del gulp-util gulp-changed gulp-inject gulp-replace --save-dev
 3. Move this file in your project folder
 4. Setup your vhosts or just use static server (see 'Prepare Browser-sync for localhost' below)
 5. Type 'Gulp' and ster developing
 */

/* Needed gulp config */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create(),
//reload = browserSync.reload,
    neat = require('node-neat'),
    gulpif = require('gulp-if'),                         // pipe with condition
    del = require('del'),                                 // delete file and folder
    ts = require('gulp-typescript'),                     // typescript compiler
    gutil = require('gulp-util'),                        // log util and more
    changed = require("gulp-changed"),                 // only pipe on files are diffrent whith source files
    inject = require('gulp-inject'),                      // Inject resource to html
    replace = require('gulp-replace'),
    filter = require('gulp-filter')
    ;

/* Settings */
var PROJECT_PATH = "/",
    BUILD_DIR_DEV = "dist/dev",
    BUILD_DIR_PROD = "dist/prod",
    BASE_DIR = "./app";
var IS_RELATIVE = false;
var sassDepsPath_src = [
    './app/assets/css/site.sass',
    './app/assets/css/theme.blue.sass',
];

var jsDepsPath_src = [
    /* NOTE: Add your JS files here, they will be combined in this order */
    'js/vendor/jquery-1.11.1.js',
    'js/app.js',
    './app/assets/js/init.js',
    //TODO: add lib js here
];

var htmlDepsPaths_Src = [
    './app/components/**/*.html',
]

var tsDepsPath_src = [
    './app/components/**/*.ts',
    './app/services/**/*.ts',
    './app/utils/**/*.ts',
    //'./app/compo/bootstrap.ts'
];

var nodeModulesSrc = [
    '@@SPEC./node_modules/systemjs/dist/system.src.js', //NOTE:
    '@@NODE./node_modules/angular2/bundles/angular2.dev.js',
    '@@NODE./node_modules/angular2/bundles/router.dev.js',
    '@@NODE./node_modules/angular2/bundles/http.dev.js',
    '@@NO_MIN_INJ./node_modules/rxjs/add/observable/*.js',
    '@@NO_MIN_INJ./node_modules/rxjs/add/operator/*.js',
    '@@NO_MIN_INJ./node_modules/rxjs/observable/*.js',
    '@@NO_MIN_INJ./node_modules/rxjs/operator/*.js',
    '@@NO_MIN_INJ./node_modules/rxjs/util/**/*.js',
    '@@NO_MIN_INJ./node_modules/rxjs/scheduler/**/*.js',
    '@@NO_MIN_INJ./node_modules/rxjs/*.js',

    //For Css
    '@@NODE./bower_components/Materialize/dist/css/materialize.css',

    //For Other file (aka font, image,...)
    '@@NODE./bower_components/jquery/dist/jquery.js',
    './bower_components/Materialize/dist/font/**/*.*',
    '@@NODE./bower_components/Materialize/dist/js/materialize.js',
    //'!./bower_components/Materialize/dist/**/*.min.*',
];

var cssNodeModulesSrc = [];


//Define list of files that exclude from inject to html index file
var excludeFromInject = [
    './node_modules/rxjs/add/observable/*.js',
    './node_modules/rxjs/add/operator/*.js',
    './node_modules/rxjs/observable/*.js',
    './node_modules/rxjs/operator/*.js',
    './node_modules/rxjs/util/**/*.js',
    './node_modules/rxjs/scheduler/**/*.js',
    './node_modules/rxjs/*.js',
    './node_modules/systemjs/dist/system.src.js'
    //'./bower_components/jquery/dist/jquery.min.js'
]

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function () {
    browserSync.init(['css/*.css', 'js/*.js'], {
        /*
         I like to use a vhost, WAMP guide: https://www.kristengrote.com/blog/articles/how-to-set-up-virtual-hosts-using-wamp, XAMP guide: http://sawmac.com/xampp/virtualhosts/
         */
        proxy: 'your_dev_site.url'
        /* For a static server you would use this: */
        /*
         server: {
         baseDir: './'
         }
         */
    });
});


/*-----------------------------------------
 * SASS, CSS TASK
 *----------------------------------------*/

/*----------------------
 * Private
 */
var sassTask = function (options, callback) {
    var run = function () {
        var task = gulp.src(sassDepsPath_src, {base: BASE_DIR})
            .pipe(changed(options.buildDir))
            .pipe(plumber({errorHandler: onError}))
            .pipe(sass())
            .pipe(gulp.dest(options.buildDir));
        if (options.minify) {
            task.pipe(gulpif(options.minify, rename({suffix: '.min'})))
                .pipe(gulpif(options.minify, minifycss()))
                .pipe(gulpif(options.minify, gulp.dest(options.buildDir)))
        }
        task.on('end', function () {
            if (options.watch)
                gutil.log('Watching css files change...')
            if (typeof callback !== 'undefined')
                callback();
        })
            /* Reload the browser CSS after every change */
            //.pipe(reload({stream: true}))
        ;

    };
    run();
    if (options.watch) {
        gulp.watch(sassDepsPath_src, run)
            .on('change', function (e) {
                logOnChange(e)
            });
    }
};

/*----------------------
 * Build Dev
 */
gulp.task('1_sass.dev', function () {
    var options = {devBuild: true, minify: false, watch: false, buildDir: BUILD_DIR_DEV};
    sassTask(options);
});

gulp.task('1_sass.dev.watch', function () {
    var options = {devBuild: true, minify: false, watch: true, buildDir: BUILD_DIR_DEV};
    sassTask(options);
});

/*----------------------
 /* Build Prod
 */
gulp.task('sass.prod', function () {
    var options = {devBuild: false, minify: false, watch: false, buildDir: BUILD_DIR_PROD};
    sassTask(options);
});


/*-----------------------------------------
 * JS TASK
 *----------------------------------------*/

var jsTask = function (options, callback) {
    var run = function () {
        var gulpResult = gulp.src(jsDepsPath_src, {base: BASE_DIR})
            .pipe(changed(options.buildDir))
            .pipe(plumber({errorHandler: onError}))
            .pipe(gulpif(!options.devBuild, concat('site.js')))
            .pipe(gulp.dest(options.buildDir));
        //WTF? gulpif here cause .on('end') not working, this is workarround by if statement
        if (options.minify) {
            gulpResult
                .pipe(gulpif(options.minify, rename({suffix: '.min'})))
                .pipe(gulpif(options.minify, uglify()))
                .pipe(gulpif(options.minify, gulp.dest(options.buildDir)))
        }
        gulpResult
            .on('end', function () {
                gutil.log('DONE JS')
                if (options.watch)
                    gutil.log('Watching js files change...')
                if (typeof callback !== 'undefined')
                    callback();
            });
    };

    run();
    if (options.watch) {
        gulp.watch(jsDepsPath_src, run)
            .on('change', function (e) {
                logOnChange(e)
            });
    }
};

gulp.task('2_js.dev', function () {
    var options = {devBuild: true, minify: false, watch: false, buildDir: BUILD_DIR_DEV};
    jsTask(options);
});

gulp.task('2_js.dev.watch', function () {
    var options = {devBuild: true, minify: false, watch: true, buildDir: BUILD_DIR_DEV};
    jsTask(options);
});


gulp.task('js.prod', function () {
    var options = {devBuild: false, minify: true, watch: false, buildDir: BUILD_DIR_PROD};
    jsTask(options);
});

//TODO: Write copy lib js here


/*-----------------------------------------
 * TYPESCRIPT
 *----------------------------------------*/
//var tsProject = ts.createProject('tsconfig.json');
//var tsProject = ts.createProject('tsconfig.json', { sortOutput: true });
var tsTask = function (options, callback) {
    var run = function () {
        var tsResult = gulp.src(tsDepsPath_src, {base: BASE_DIR}) // instead of gulp.src(...)
            .pipe(plumber())
            .pipe(changed(options.buildDir))
            .pipe(ts({
                "target": "es5",
                "module": "commonjs",
                "declaration": true,
                "noImplicitAny": false,
                "removeComments": true,
                "noLib": false,
                "emitDecoratorMetadata": true,
                "experimentalDecorators": true,
                "sourceMap": true
            }));
        return tsResult.js
            .pipe(gulp.dest(options.buildDir))
            .on('end', function () {
                if (options.watch)
                    gutil.log('Watching ts files change...')
                if (typeof callback !== 'undefined')
                    callback();
            })
            ;
    }
    run();
    if (options.watch) {
        gulp.watch(tsDepsPath_src, run)
            .on('change', function (e) {
                logOnChange(e)
            });
    }
}

gulp.task('3_ts.dev', function () {
    var options = {devBuild: true, minify: false, watch: false, buildDir: BUILD_DIR_DEV};
    tsTask(options);
});
gulp.task('ts.dev+clean', ['clean.ts.dev'], function () {
    var options = {devBuild: true, minify: false, watch: false, buildDir: BUILD_DIR_DEV};
    tsTask(options);
});
gulp.task('3_ts.dev.watch', function () {
    var options = {devBuild: true, minify: false, watch: true, buildDir: BUILD_DIR_DEV};
    tsTask(options);
});
gulp.task('ts.dev.watch+clean', ['clean.ts.dev'], function () {
    var options = {devBuild: true, minify: false, watch: true, buildDir: BUILD_DIR_DEV};
    tsTask(options);
});
gulp.task('ts.prod', function () {
    var options = {devBuild: false, minify: true, watch: false, buildDir: BUILD_DIR_PROD};
    tsTask(options);
});


/*-----------------------------------------
 * HTML
 *----------------------------------------*/
var htmlTask = function (options) {
    var cssDest = convertBuildPaths(sassDepsPath_src, options.buildDir, '.sass', '.css');
    var jsDest = convertBuildPaths(jsDepsPath_src, options.buildDir, '', '');
    var nodeDest = injectArray(nodeModulesSrc, options, '@@NODE');
    var specDest = injectArray(nodeModulesSrc, options, '@@SPEC');
    //TODO: Implement Bower resource management
    //process.stdout.write(cssDest)
    var run1 = function () {
        gulp.src(htmlDepsPaths_Src, {base: BASE_DIR})
            .pipe(gulp.dest(options.buildDir));
    }
    var run = function () {
        gulp.src(['./app/index.html'], {base: BASE_DIR})
            //.pipe(changed(options.buildDir))
            .pipe(plumber({errorHandler: onError}))
            .pipe(gulp.dest(options.buildDir))
            .pipe(inject(gulp.src(specDest, {read: false}), {relative: IS_RELATIVE, name: 'specialjs'}))
            .pipe(inject(gulp.src(nodeDest, {read: false}), {relative: IS_RELATIVE, name: 'nodecss'}))//For css
            .pipe(inject(gulp.src(nodeDest, {read: false}), {relative: IS_RELATIVE, name: 'nodejs'}))
            .pipe(inject(gulp.src(jsDest, {read: false}), {relative: IS_RELATIVE, name: 'libjs'}))
            .pipe(inject(gulp.src(cssDest, {read: false}), {relative: IS_RELATIVE}))
            .pipe(replace('<%APP_ROOT_PATH%>', BUILD_DIR_DEV))
            .pipe(gulp.dest(options.buildDir));
    }
    run();
    run1();
    if (options.watch) {
        gulp.watch(htmlDepsPaths_Src, run1)
            .on('change', function (e) {
                logOnChange(e)
            });
        gulp.watch(['./app/index.html'], run)
            .on('change', function (e) {
                logOnChange(e)
            });
    }
}

//NOTE: Run gulp css, js, ts first
gulp.task('5_html.dev', function () {
    var options = {devBuild: true, minify: false, watch: false, buildDir: BUILD_DIR_DEV};
    htmlTask(options);
});
gulp.task('5_html.dev.watch', function () {
    var options = {devBuild: true, minify: false, watch: true, buildDir: BUILD_DIR_DEV};
    htmlTask(options);
});


/*-----------------------------------------
 * LIBS
 *----------------------------------------*/
var libTask = function (options, callback) {
    var run = function () {
        const filterCss = filter(['**/*.css', '!*.min.css'], {restore: true});
        const filterJs = filter(['**/*.js', '!@@NO_MIN_INJ*'], {restore: true});
        var gulpJs = gulp.src(normalArray(nodeModulesSrc), {base: './'});

        gulp.src(excludeMinArray(nodeModulesSrc, {minify: false}, '@@NO_MIN_INJ'), {base: BASE_DIR})
            .pipe(gulp.dest(options.buildDir + '/assets/lib/node_modules'))
            .pipe(gulp.dest(options.buildDir + '/assets/lib/bower_components'))
        ;

        if (options.minify) {
            gulpJs = gulpJs
                .pipe(filterJs)
                .pipe(rename({suffix: '.min'}))
                .pipe(uglify())
                .pipe(filterJs.restore)
                .pipe(filterCss)
                .pipe(rename({suffix: '.min'}))
                .pipe(minifycss())
                .pipe(filterCss.restore)
                .pipe(gulp.dest(options.buildDir + '/assets/lib/'))
            //.pipe(gulp.dest(options.buildDir + '/assets/lib/'))
        } else {
            gulpJs = gulpJs
                .pipe(gulp.dest(options.buildDir + '/assets/lib/'))
            //.pipe(gulp.dest(options.buildDir + '/assets/lib/'))
        }
        gulpJs.on('end', function () {
            if (typeof callback !== 'undefined') {
                callback();
            }
        });
    }
    run();
}
gulp.task('6_lib.dev', function () {
    var options = {devBuild: true, minify: false, watch: false, buildDir: BUILD_DIR_DEV};
    libTask(options);
})
gulp.task('6_lib.dev.clean', ['clean.lib'], function () {
    var options = {devBuild: true, minify: false, watch: false, buildDir: BUILD_DIR_DEV};
    libTask(options);
})


/*-----------------------------------------
 * ALL DEV
 *----------------------------------------*/
gulp.task('4_all.dev.!html', ['1_sass.dev', '2_js.dev', '3_ts.dev'])
gulp.task('4_all.dev.watch.!html', ['1_sass.dev.watch', '2_js.dev.watch', '3_ts.dev.watch'])

gulp.task('4_all.dev', function () {
    var options = {devBuild: true, minify: false, watch: false, buildDir: BUILD_DIR_DEV};
    sassTask(options, function () {
        jsTask(options, function () {
            tsTask(options, function () {
                libTask(options, function () {
                    htmlTask(options);
                });
            });
        });
    });
});
gulp.task('4_all.dev.watch', function () {
    var options = {devBuild: true, minify: false, watch: true, buildDir: BUILD_DIR_DEV};
    sassTask(options, function () {
        jsTask(options, function () {
            tsTask(options, function () {
                libTask(options, function () {
                    htmlTask(options);
                });
            });
        });
    });
});


/*-----------------------------------------
 * CLEAN
 *----------------------------------------*/
gulp.task('clean.js', function () {
    del(BUILD_DIR_DEV + '/assets/**/*.js')
});
gulp.task('clean.css', function () {
    del(BUILD_DIR_DEV + '/assets/**/*.css')
});
gulp.task('clean.lib', function () {
    del(BUILD_DIR_DEV + '/assets/lib/*')
});

gulp.task('clean.ts.dev', function () {
    del(convertBuildPaths(tsDepsPath_src, BUILD_DIR_DEV, '.ts', '.js'))
});
gulp.task('clean.ts.prod', function () {
    del(convertBuildPaths(tsDepsPath_src, BUILD_DIR_PROD, '.ts', '.js'))
});
gulp.task('clean.all.dev', function () {
    del('dist/dev')
});

gulp.task('clean.all.prod', function () {
    del('dist/prod')
});

gulp.task('clean.all', function () {
    del('dist')
});


/*-----------------------------------------
 * BROWSER
 *----------------------------------------*/
gulp.task('0_browse.dev', function () {
    browserSync.init([BUILD_DIR_DEV + "/**/*.html",
        BUILD_DIR_DEV + "/**/*.css",
        BUILD_DIR_DEV + "/**/*.js",], {
        server: {
            baseDir: BUILD_DIR_DEV
        },
        //proxy: '127.0.0.1:9999',
    });
    //gulp.watch([BUILD_DIR_DEV + "/**/*.html",
    //    BUILD_DIR_DEV + "/**/*.css",
    //    BUILD_DIR_DEV + "/**/*.js",
    //]).on('change', browserSync.reload);
});

gulp.task('0_Exit-sever.dev', browserSync.exit);


/*-----------------------------------------
 * UTILS
 *----------------------------------------*/

function logOnChange(e) {
    console.log('File ' + e.path + ' was ' + e.type + ' and commited');
    //browserSync.reload;
}
var onError = function (err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);

    //  this.emit('end');
};


function convertBuildPaths(srcPaths, buildDir, replaceExt, byExt) {
    var paths = new Array();
    srcPaths.forEach(function (item) {
        var replace = item.replace('./app', buildDir).replace(replaceExt, byExt);
        paths.push(replace)
    });
    return paths;
}

function libToInject(srcArr, options) {
    var paths = new Array();
    srcArr.forEach(function (item) {
        if (excludeFromInject.indexOf(item) <= -1) {
            var replace = item.replace('./node_modules', options.buildDir + '/assets/lib/node_modules')
                .replace('./bower_components', options.buildDir + '/assets/lib/bower_components')
                .replace('.css', options.minify ? '.min.css' : '.css')
                .replace('.js', options.minify ? '.min.js' : '.js')
                ;
            paths.push(replace)
        }
    });
    return paths;
}

function libToCopy(buildDir) {
    var paths = new Array();
    nodeModulesSrc.forEach(function (item) {
        var replace = item.replace('@', '');
        paths.push(replace)
    });
    return paths;
}

function filterArray(arr, eachItemFunc) {
    var newArr = new Array();
    arr.forEach(function (item) {
        //var replace = item.replace('@', '');
        var newItem = eachItemFunc(item);
        if (typeof newItem !== 'undefined' || newItem != null)
            newArr.push(newItem);
    });
    return newArr;
}

function normalArray(arr) {
    return filterArray(arr, function (item) {
        return item.replace('@@NODE', '')
            .replace('@@SPEC', '')
            // .replace('@@NO_MIN_INJ', '')
            ;
    })
}

function injectArray(arr, options, pattern) {
    return filterArray(arr, function (item) {
        if (item.lastIndexOf(pattern, 0) === 0) {
            if (options.minify)
                return item
                    .replace('./node_modules', options.buildDir + '/assets/lib/node_modules')
                    .replace('./bower_components', options.buildDir + '/assets/lib/bower_components')
                    .replace('.css', '.min.css')
                    .replace('.js', '.min.js')
                    .replace('.min.min.', '.min.')
                    .replace(pattern, '');
            else
                return item
                    .replace('./node_modules', options.buildDir + '/assets/lib/node_modules')
                    .replace('./bower_components', options.buildDir + '/assets/lib/bower_components')
                    .replace(pattern, '');
        }
    })
}

function excludeMinArray(arr, options, pattern) {
    return filterArray(arr, function (item) {
        if (item.lastIndexOf(pattern, 0) === 0) {
            return item.replace(pattern, '');
        }
    })
}
//DOCS
//
/*
 var cssTask = function (options) {
 var minifyCSS = require('gulp-minify-css'),
 less = require('gulp-less'),
 src = cssDependencies;

 src.push(codePath + '**!/!*.less');

 var run = function () {
 var start = Date.now();

 console.log('Start building CSS/LESS bundle');

 gulp.src(src)
 .pipe(gulpif(options.devBuild, plumber({
 errorHandler: onError
 })))
 .pipe(concat('main.css'))
 .pipe(less())
 .pipe(gulpif(options.minify, minifyCSS()))
 .pipe(gulp.dest(buildPath + 'css'))
 .pipe(gulpif(options.devBuild, browserSync.reload({stream:true})))
 .pipe(notify(function () {
 console.log('END CSS/LESS built in ' + (Date.now() - start) + 'ms');
 }));
 };

 run();

 if (options.watch) {
 gulp.watch(src, run);
 }
 };

 gulp.task('dev', function () {
 var options = {
 devBuild: true,
 minify: false,
 watch: false
 };

 cssTask (options);
 });*/
