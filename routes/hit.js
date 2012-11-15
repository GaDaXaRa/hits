var Hit = require('../model/hit'),
    Query = require('../model/query'),
    _ = require('underscore');

exports.doHit = function(req, res) {
    var data = new Object;
    var contentId = req.body.contentId;

    if (contentId) {
        data.c = contentId;
    }

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
            res.json({status: 'error'});
            console.log(err);
            return;
        }
    });

    res.json({status: "ok"});
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
        res.json({status: 'error'});
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
            res.json({status: 'error'});
            console.log(err);
            return;
        }

        res.json(results);
    });
}