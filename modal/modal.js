/*** Modal module to be reused throughout project, requires jQuery ***/
/* Example:
    modal.init({
        content: '<div>Modal Content</div>',
        container: $('#modal_container')
    }, () => { console.log('Modal is closing'); });
    modal.show();
 */


//Initialize settings object and onClose function
let settings = {},
    onClose;

//Accepts options as an object and a function that will be called when modal is closed.
//Content can be in the form of a string or a rendered Mustache template
function init(opts, onCloseFn) {
    settings = opts;
    onClose = onCloseFn;

    opts.container.append(opts.content);

    _renderOverlay();
    _bindUIActions();
}

//Shows modal container
function show() {
    settings.container.show();
}

//Hides & empties modal container, removes overlay, fires off onClose function (if specified)
function close() {
    settings.container.hide();
    settings.container.empty();

    $('#overlay').remove();

    if (typeof onClose === 'function') { onClose(); }
}

//Returns specified selector to be used for further DOM manipulation or event binding
function find(selector) {
    return settings.container.find(selector);
}

//Binds DOM events to generic elements
function _bindUIActions() {
    settings.container.on('click', '.close', () => {
        close();
    });

    $(document).on('keyup', (e) => {
        if (e.keyCode === 27) { close(); }
    });

    $('#overlay').off().on('click', () => {
        close();
    })
}

//Renders overlay behind modal
function _renderOverlay() {
    let overlay = '<div id="overlay"></div>';

    $('body').addClass('overlay').append(overlay);
}