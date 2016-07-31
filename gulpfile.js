var gulp = require('gulp');
// typescript扱う
var typescript = require('gulp-typescript');
// jsを結合しておく
var concat = require('gulp-concat');
// 削除するのに使う
var del = require('del');
// shellを実行する場合に必要。今回はいらないかな。
var exec = require('gulp-exec');
// エラーおきても止めない
var plumber = require('gulp-plumber');
// ブラウザで確認する
var browserSync = require('browser-sync').create();

// destの中身消す。(一番はじめだけ実行しておく。)
gulp.task('clean:dest', function() {
    return del.sync(['dest/**/*']);
});

// emscriptenのコンパイル書くの面倒なので、関数にして、使いまわせるようにしとく。
// あ、でもあれか・・worker用のコンパイルとかあって面倒か・・・うーん。
var emcc = function(srcs, funcs, libs, output, postJs, option) {
    funcs2 = [];
    funcs.forEach(function(func) {
        funcs2.push('\'_' + func + '\'');
    });
    return ['emcc', srcs.join(' '), '-o', output, '-s EXPORTED_FUNCTIONS="[', funcs2.join(','),
            ']" -s RESERVED_FUNCTION_POINTERS=40 -s ASSERTIONS=2 -L./native/libs/lib/', libs.join(' '),
            '-O2 --post-js',
            postJs,
            option
    ].join(' ');
}

// ttLibJsEmcを作る。
gulp.task('make:ttLibJsEmc:compile', function() {
    var ts = gulp.src(['src/ts/**/*.ts', '!src/ts/app.ts', '!src/ts/worker/*.ts'])
        .pipe(typescript({declaration:true, noExternalResolve:false}));
    return ts.js.pipe(concat('.emc.js')).pipe(gulp.dest('./'))
        .pipe(plumber()).pipe(exec(emcc(
            [
                './src/c/decoder/opusDecoder.c',
                './src/c/decoder/speexDecoder.c',
                './src/c/decoder/theoraDecoder.c',
                './src/c/encoder/opusEncoder.c',
                './src/c/encoder/speexEncoder.c',
                './src/c/encoder/theoraEncoder.c',
                './src/c/resampler/speexdspResampler.c'
            ],
            [
                'theoraDecoder_close', 'theoraDecoder_make', 'theoraDecoder_decode',
                'opusDecoder_close',   'opusDecoder_make',   'opusDecoder_decode',
                'speexDecoder_close',  'speexDecoder_make',  'speexDecoder_decode',
                'theoraEncoder_close', 'theoraEncoder_make', 'theoraEncoder_encode',
                'opusEncoder_close',   'opusEncoder_make',   'opusEncoder_encode',
                'speexEncoder_close',  'speexEncoder_make',  'speexEncoder_encode',
                'speexdspResampler_close', 'speexdspResampler_make', 'speexdspResampler_resample'
            ],
            [
                '-lttLibC',
                '-lopus',
                '-lspeex',
                '-lvorbis',
                '-lvorbisenc',
                '-ltheora',
                '-lspeexdsp',
                '-logg'
            ],
            'ttLibJsEmc.js',
            '.emc.js',
            '')))
        .pipe(exec.reporter({err:true, stderr:true, stdout:true}))
        .on('end', function() {
            return ts.dts.pipe(concat('index.d.ts')).pipe(gulp.dest('./'));
        });
});

// compileしてからコピーする。
gulp.task('make:ttLibJsEmc', ['make:ttLibJsEmc:compile'], function() {
    // このタイミングでttLibJsEmc.jsとttLibJsEmc.js.memをコピーする。
    return gulp.src(['ttLibJsEmc.js', 'ttLibJsEmc.js.mem'])
        .pipe(gulp.dest('dest/js/'));
});

gulp.task('make:app', function() {
    return gulp.src(['src/ts/app.ts']).pipe(plumber())
        .pipe(typescript()).js.pipe(gulp.dest('dest/js/'));
});

gulp.task('make:theoraEncoder', function() {
    return gulp.src([
            'src/ts/worker/theoraEncoder.ts',
            'src/ts/encoder/theoraEncoder.ts'])
        .pipe(typescript()).js.pipe(concat('.theoraEncoder.js')).pipe(gulp.dest('./'))
        .pipe(plumber()).pipe(exec(emcc(
            ['./src/c/encoder/theoraEncoder.c'],
            ['theoraEncoder_close', 'theoraEncoder_make', 'theoraEncoder_encode'],
            ['-lttLibC','-ltheora','-logg'],
            'dest/js/theoraEncoder.js',
            '.theoraEncoder.js',
            '--llvm-lto 1 --memory-init-file 0')))
        .pipe(exec.reporter({err:true, stderr:true, stdout:true}))
});

gulp.task('compile:worker', function() {
    return gulp.src([
        'src/ts/worker/theoraEncoder.ts',
        'src/ts/encoder/theoraEncoder.ts'])
    .pipe(typescript())
    .js.pipe(concat('theoraEncoder.js')).pipe(gulp.dest('./dest/js/'));
});

// htmlのコピー
gulp.task('copy:html', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dest'));
});

// bowerのデータコピー
gulp.task('copy:bower', function() {
    return gulp.src(
            ['src/js/bower_components/**'],
            {base:'src/js'})
        .pipe(gulp.dest('dest/js'));
});

// httpでアクセスできるようにする。
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: 'dest'
        },
        files: [
            'dest/*.html',
            'dest/**/*.js', 
        ]
    });
});

// ts,htmlが編集されたらタスクを再実行
gulp.task('watch', function(){
    gulp.watch(
        ['src/ts/**/*.ts', '!src/ts/app.ts', '!src/ts/worker/*.ts']
        ['make:ttLibJsEmc']);
    gulp.watch(
        ['src/ts/app.ts'],
        ['make:app']);
    gulp.watch(
        ['src/*.html'],
        ['copy:html']); 
});

gulp.task('default', [
    'clean:dest',
    'make:ttLibJsEmc',
    'make:app',
    'make:theoraEncoder',
    'copy:html',
    'copy:bower',
    'watch'
],
function() {
    browserSync.init({
        server: {
            baseDir: 'dest',
//            https:true
        },
/*        https: {
            key: 'server_key.pem',
            cert: 'server_crt.pem'
        },
*/        files: [
            'dest/*.html',
            'dest/**/*.js', 
        ]
    });
});
