var Hit = require('../model/hit'),
    Query = require('../model/query'),
    _ = require('underscore'),
    Nonce = require('../model/nonce');
    Hash = require('../model/hash');

var service = 'hit'

exports.doHit = function(req, res) {
    var hash = req.body.hash;

    if (!hash) {
        res.json({error: 'Forbidden'}, 403);
        console.log("No se ha especificado hash");
        return;
    }

    var contentId = req.body.contentId;
    var key = req.body.key;

    if (!contentId) {
       res.json({error: 'contentId is mandatory'}, 400);
       console.log("No se ha especificado contentId");
       return;
    }

    if (!key) {
        res.json({error: 'Forbidden'}, 403);
        console.log("No se ha especificado key");
        return;
    }

    var nonce = hash + req.sessionID;

    Nonce.exist(nonce, function (err, exists) {
        if (exists) {
            res.json({error: 'Forbidden'}, 403);
            console.log("El nonce ya existe");
            return;  
        }

        var data = new Object;
        data.c = contentId;

        Hash.validateHash(hash, contentId, service, key, function(err, isValid) {  
            if (err || !isValid) {
                res.json({error: 'Forbidden'}, 403);
                console.log("El hash no es válido");
                return;
            }

            Nonce.store(nonce, function() {
                var type = req.body.type;

                if (type) {
                    data.t = type;
                }

                var breadcrum = req.body.breadcrum;

                if (breadcrum && _.isArray(breadcrum)) {
                    data.b = _.invoke(breadcrum, 'toLowerCase');
                }

                var tags = req.body.tags;

                if (tags && _.isArray(tags)) {
                    data.w = _.invoke(tags, 'toLowerCase');
                }

                Hit.doHit(data, function(err, element){
                    if (err) {
                        res.json({error: err}, 400);
                        console.log(err);
                        return;
                    }
                });

                res.json({status: "ok"});  
            });            
        });    
    });    
}

exports.find = function(req, res) {
    var query = new Query;
    var section = req.params.section;

    if (section && section != 'all') {
        query.breadcrum = _.invoke([section], 'toLowerCase');
    }

    var type = req.params.type;

    if (type && type != 'all') {
        query.type = type;
    }

    var days = req.params.days;

    if (!days) {
        res.json({error: 'Days argument is mandatory'}, 500);
        return;
    }

    var startDate = new Date;
    startDate.setDate(startDate.getDate() - days);

    query.startDate = startDate;
    query.endDate = new Date;

    var tag = req.params.tag;
    if (tag && tag != 'none') {
        query.tags = _.invoke([tag], 'toLowerCase');
    }

    var numResults = req.params.numResults;
    if (numResults) {
        query.results = parseInt(numResults);
    }

    Hit.findMostHitted(query, function(err, results) {
        if (err) {
            res.json({error: err}, 500);
            console.log(err);
            return;
        }

        res.json(results);
    });
}