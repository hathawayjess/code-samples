/**Used in Electron.js application as a wrapper around internal API**/
/*Ex:
    let API = require('./ajax');
    API.get('example/api/endpoint, '?order_number=321')
       .done((res) => {
            console.log('Server response: ', res);
        }
 */

const config = require('config'),
      notifications = require('./notifications');

//Check if URL host matches what is configured
function isValidURL(url) {
    let host = config.host;
    return url.includes(`${host}/`);
}

//Format the URL, including protocol, host, path and query params
function getURL(path, query) {
    let urlOptions = {
        protocol: config.protocol,
        host: config.host,
        pathname: path,
        search: query
    };
    return url.format(urlOptions);
}

//Send AJAX request
function _send(url, method, data) {
    let query = '';

    if (url.indexOf('?') > -1) {
        let split = url.split('?');
        url = split[0];
        query = `?${split[1]}`;
    }

    let params = {
        url: getURL(url, query),
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        params.data = JSON.stringify(data);
    }

    return $.ajax(params).done(_onSuccess).fail(_onError).always(_onAlways);
}

function _isError(r) { return r && !r.status || r.status === 'error'; }

function _isCancelled(r) { return r && r.status === 'cancelled'; }

function _onSuccess(r, cb) {
    if (_isError(r)) { return _onError(r); }
    if (_isCancelled(r)) { return _onError(r); }
    return typeof(cb) === 'function' ? cb(r) : undefined;
}

function _onError(r, cb) {
    if (r.status === 401) {
        //handle expired session
    }

    if (r.status === 'cancelled') {
        return notifications.notify({
            type: 'warning',
            msg: `This product has been cancelled and can be removed from production. 
                  No further action is required with it!`,
            persist: true
        })
    }

    let msg = r.message || 'An unknown error occurred';

    notifications.notify({
        type: 'error',
        msg: msg,
        duration: 5
    });

    if (typeof(cb) === 'function') { cb(r); }
}

function _onAlways(r) {
    return console.info('Server response: ', r);
}

module.exports.get = function (url, data) { return _send(url, 'GET', data); };
module.exports.put = function (url, data) { return _send(url, 'PUT', data); };
module.exports.post = function (url, data) { return _send(url, 'POST', data); };
module.exports.isValidURL = isValidURL;