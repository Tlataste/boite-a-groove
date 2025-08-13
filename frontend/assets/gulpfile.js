/**
 * Module Themer KI v2.1.4
 * SASS+ / LESS+ / JS?
 * Syntax Javascript ES 6
 */
'use strict';
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const through2 = require('through2');
const log = require('fancy-log');
const lazypipe = require('lazypipe');
const mergeStream = require('merge-stream');
const currentVersion = require('node-version');

// --- Remplacements/ajouts importants ---
const autoprefixer = require('gulp-autoprefixer'); // import explicite
const cleanCSS = require('gulp-clean-css');        // import explicite

// Utiliser dart-sass via gulp-sass@5 (plus de node-sass/libsass)
const dartSass = require('sass');
const gulpSass = require('gulp-sass')(dartSass);

/**
 * ---------------------------------------
 * Configuration
 * ---------------------------------------
 */
let configFile = require('./projects.json');
let _config = configFile.config,
    _projects = configFile.projects;

/**
 * ---------------------------------------
 * Functions utils
 * ---------------------------------------
 */

/**
 * Files preparation & Lazy Pipes
 * Gulp mixin task
 */
let tools = {
    createFilePathList(srcDir, fileNamesArray) {
        let filePathList = [];
        fileNamesArray.forEach((fileName) => {
            const filePath = path.join(srcDir, fileName);
            if (fs.existsSync(filePath)) {
                filePathList.push(filePath);
            } else {
                log(chalk.red('   Oups fichier introuvable...'), filePath);
            }
        });
        return filePathList;
    },
    createProjectsArray(projects) {
        const _this = this;

        projects.forEach((project) => {
            log('  Project Found:', chalk.green(project.name ? project.name : 'n/a'), 'in', chalk.green(project.path), chalk.reset(' '));
            project.filePathList = _this.createFilePathList((path.join(project.path, project.dir.src)), project.files);
        });

        if (projects.length)
            log('-- Config OK! Found', projects.length, 'project(s)');
        else
            log.warn('-- Configuration empty...');
        log(); // Empty line to keep aeration
        return projects;
    },
    lintSassPipelineBuilder(compiler) {
        const sassLintEnabled = (_config.lint.sass && compiler === 'sass');
        return lazypipe()
            .pipe(() => {
                return $.if(sassLintEnabled, $.sassLint())
            })
            .pipe(() => {
                return $.if(sassLintEnabled, $.sassLint.format())
            })
            .pipe(() => {
                return $.if((sassLintEnabled && _config.lint.failOnError), $.sassLint.failOnError())
            });
    },
    cssCompilerPipelineBuilder(compiler, sourcemap, minify) {
        return lazypipe()
            .pipe(() => {
                return $.if(sourcemap, $.sourcemaps.init())
            })
            .pipe(() => {
                return $.if((compiler === 'less'), $.less());
            })
            // Compilation SCSS avec dart-sass
            .pipe(() => {
                return $.if((compiler === 'sass'),
                    gulpSass({ /* outputStyle non compressé, on minifie ensuite avec cleanCSS si demandé */ })
                    .on('error', gulpSass.logError)
                );
            })
            // Autoprefixer (appel direct, pas via gulp-load-plugins)
            .pipe(() => {
                return autoprefixer();
            })
            // Minification conditionnelle
            .pipe(() => {
                return $.if(minify, cleanCSS());
            })
            // Sourcemaps en fin de pipeline si demandé
            .pipe(() => {
                return $.if(sourcemap, $.sourcemaps.write('.'))
            });
    },
    printTaskState(project, type) {
        return through2({ objectMode: true }, function (chunk, enc, callback) {
            log(
                chalk.blue.bold('[Compiling]\t'),
                chalk.green(project.name ? project.name : 'n/a') +
                chalk.magenta(' => ', path.join(chunk.base, chunk.basename)) +
                chalk.reset(' ')
            );
            this.push(chunk);
            callback();
        });
    },
    printLintTaskState(project, type) {
        return through2({ objectMode: true }, function (chunk, enc, callback) {
            log(
                chalk.red.bold('[Linting]\t'),
                chalk.green(project.name ? project.name : 'n/a') +
                chalk.grey(' => ', path.join(chunk.base, chunk.basename)) +
                chalk.reset(' ')
            );
            this.push(chunk);
            callback();
        });
    },
    prepareProjectPipes(projects, sourcemap, minify) {
        const _this = this;
        let mainStream = mergeStream();

        projects.forEach((project) => {
            // Linter
            if (project.lint) {
                const lintStream = gulp.src(
                        path.join(project.path, project.dir.src) + '/**/*' + _config.extension[project.compiler],
                        { base: (path.join(project.path, project.dir.src)), allowEmpty: true })
                    .pipe(_this.printLintTaskState(project))
                    .pipe(_this.lintSassPipelineBuilder(project.compiler)());
                mainStream.add(lintStream);
            }

            // Compiler
            const tmpStream = gulp.src(project.filePathList, { base: (path.join(project.path, project.dir.src)), allowEmpty: true })
                .pipe(_this.printTaskState(project))
                .pipe(_this.cssCompilerPipelineBuilder(project.compiler, sourcemap, minify)())
                .pipe(gulp.dest(path.join(project.path, project.dir.dest)));

            mainStream.add(tmpStream);
        });

        return mainStream;
    }
};

/**
 * Start / Init function
 */

log.info(chalk.green('#########################################'));
log.info(chalk.green('##    Module Themer KI SASS & LESS     ##'));
log.info(chalk.green('#########################################'));
log.info('This module version ', configFile.version);

// dart-sass supporte Node >=14
if (currentVersion.major < 14) {
    log.info('Node Version', process.version, chalk.red.bold('Not supported (<14)'), chalk.reset(' '));
    log.warn(chalk.reset('-----------------------'));
    log.warn(chalk.red.bold('!! Your Node version is not supported !!'), chalk.reset(' '));
    log.warn(chalk.red.bold('(requires Node >= 14)'), chalk.reset(' '));
    log.warn(chalk.reset('-----------------------'));
} else {
    log.info('Node Version', process.version, chalk.green.bold('OK'), chalk.reset(' '));
}
log.info(chalk.green('## Preparation...'));

// Prepares projects and their files
let projectsPrepared = tools.createProjectsArray(_projects);

/**
 * ---------------------------------------
 * GULP TASKS
 * ---------------------------------------
 */

// Dev: sourcemaps oui, minify non
gulp.task('dev', () => {
    return tools.prepareProjectPipes(projectsPrepared, true, false);
});

// Dev sans sourcemaps
gulp.task('dev-sans-sourcemap', () => {
    return tools.prepareProjectPipes(projectsPrepared, false, false);
});

// Prod: minify oui, sourcemaps non
gulp.task('prod', () => {
    return tools.prepareProjectPipes(projectsPrepared, false, true);
});

// Watcher
gulp.task('watcher-dev', () => {
    let sourcemap = true, minify = false;

    projectsPrepared.forEach((project) => {
        gulp.watch(
            path.join(project.path, project.dir.src, "**/*" + _config.extension[project.compiler]).replace(/\\/g, '/'),
            { usePolling: _config.partageReseau },
            function compilation () {
                return tools.prepareProjectPipes([project], sourcemap, minify);
            }
        );
    });
});

// Par défaut: dev + watcher
gulp.task('default', gulp.series('dev', 'watcher-dev'));
