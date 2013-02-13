var crypto = require('crypto');
var KeyWarehouse = require('../model/keyWarehouse');
var algo = 'sha1';

exports.getHash = function(content, service, key, callback) {    
    KeyWarehouse.getPrivateKey(key, function(err, element) {
        if (element) {
            callback(err, digest(content, service, element.p));
        } else {
            callback('public key does not exist', undefined);
        }
    });
}

exports.validateHash = function(hash, content, service, key, callback) {
    if (!hash) return false;

    KeyWarehouse.getPrivateKey(key, function(err, element) {
        if (element) {
            callback(err, hash == digest(content, service, element.p));
        } else {
            callback('public key does not exist', undefined);
        }
    });
}

var digest = function(content, service, key) {
    var hash = crypto.createHash(algo);
    var text = service + key + content;
    hash.update(text);
    return hash.digest('hex');
}