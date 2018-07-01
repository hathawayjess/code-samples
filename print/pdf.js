const {ipcRenderer} = require('electron');
const {app} = require('electron').remote;

let Mustache =  require('mustache'),
    modal = require('./modal.js'),
    request = require('request'),
    API = require('./ajax.js'),
    config = require('config'),
    fs = require('fs'),
    path = require('path'),
    loader = require('./loader');
    PDF_MAP = require('../../pdf_map.js');

//Find the folder where user/app data is stored on the OS
let tempPath = app.getPath('userData');

//Accepts url, type of PDF (used to determine which printer to send document to), id, template and container
exports.show = function(url, type, id, template, container) {
    let pdfHTML = Mustache.render(template.html(), {url: url, id: id, printing: config.printing_enabled});

    modal.init({
        container: container,
        content: pdfHTML
    }, () => { $('#id_input').focus(); });

    let $printBtn = modal.find($('.print_pdf')),
        $el = modal.find('webview');

    //Bind print behavior to print button in modal
    $printBtn.on('click', function() {
        module.exports.print(url, type, $el);
    });

    modal.show();
};

exports.print = function(url, type, $el) {
    loader.show($el);

    let options = {
        url: url,
        method: 'GET',
        encoding: 'binary'
    };

    //Join tempPath with PDF path (based on configured value)
    let pdfPath = path.join(tempPath, PDF_MAP[type].path);

    if (API.isValidURL(url)) {
        options.headers = { Authorization: 'Bearer ' + config.publicKey };
    }

    request(options, function (err, res, body) {
        if (err) { handler.err(err); }

        //Save response to PDF path
        fs.writeFileSync(pdfPath, body, 'binary', (error) => {
            console.log('error', error);
        });

        //Here we tell Electron's main process to print the PDF to the specified printer
        ipcRenderer.send('print-pdf', { type: type, pdf_path: pdfPath });

        loader.hide($el);
    });
};