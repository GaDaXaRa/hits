var hash = require('../model/hash');

exports.getHash = function(req, res) {
    var key = req.params.key;
    var content = req.params.content;
    var service = req.params.service;

    hash.getHash(content, service, key, function(err, element) {
        if (err) {
            res.json({message: err}, 404);
            return;
        }
                
        res.json(element);
    });    
}