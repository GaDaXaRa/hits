var Hit = require('../model/hit'),
    Query = require('../model/query');

exports.doHit = function(req, res) {
    var data = new Object;
    var contentId = req.body.contentId;
    if (contentId) {
        data.contentId = contentId;
    }
    var type = req.body.type;
    if (type) {
        data.type = type;
    }
    var breadcrum = req.body.breadcrum;
    if (breadcrum) {
        data.breadcrum = breadcrum;
    }
    var tags = req.body.tags;
    if (tags) {
        data.tags = tags;
    }

    console.log(data);

    Hit.doHit(data, function(err, element){
        if (err) throw err;
        console.log(element);
    });

    res.send(200);
}

exports.find = 