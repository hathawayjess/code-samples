//Command line printing used with SumatraPDF
let child_process = require('child_process');

module.exports.print = function(pathToFile, pathToViewer, printer, cb) {
    let command = `"${pathToViewer}" -print-to "${printer}" -silent "${pathToFile}"`;
    child_process.exec(command, cb);
};