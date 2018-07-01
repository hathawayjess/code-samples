/*** Build script used in Electron application ***/

const Mustache = require('mustache'),
    fs = require('fs'),
    path = require('path'),
    FILE_MAP = require('./file_map.js');

let mainHTML = readFile('../index.html'),
    htmlDir = path.join(__dirname, `../gui/html`);

function readFile(file_path) {
    return fs.readFileSync(path.join(__dirname, file_path), 'utf8');
}

//Injects html, css, and scripts into template and write to built html file
function buildHTML(page) {
    console.log(`Building html for: ${page.title}`);

    let output = Mustache.render(mainHTML, page);
    fs.writeFileSync(path.join(__dirname, `./html/${page.title}.built.html`), output, 'utf8', (err) => {
        if (err) { throw err; }
        console.log(`${page.title} file saved!`);
    });
}

//Check if html directory exists. If it doesn't, creates it.
if (!fs.existsSync(htmlDir)){ fs.mkdirSync(htmlDir); }

//Loop over file map and build each one
for (let page of FILE_MAP) {
    page.content = readFile(page.content);
    buildHTML(page);
}