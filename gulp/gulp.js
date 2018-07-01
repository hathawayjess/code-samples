/**Got tired of running build task every time I made changes to the HTML,
 * so voila, Gulp task to watch for changes to HTML and rebuild templates.
 * A little redundant, I'm planning on moving the build script into this gulpfile**/

const gulp = require('gulp'),
    child_process = require('child_process');

let watcher = gulp.watch('templates/*.html', ['build']);

watcher.on('change', function(event) {
    console.log(`File ${event.path} was ${event.type}, running tasks...`)
});

gulp.task('build', function() {
    console.log('Building html templates...');
    child_process.exec('npm run build');
});

gulp.task('default', ['build']);