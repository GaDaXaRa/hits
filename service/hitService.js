require('../model/hit');

var mongoose = require('mongoose')
, HitModel = mongoose.model('Hit')

function HitService () {}

HitService.prototype = {
    doHit: function (contentId, callback) {
        var hit = new HitModel({contentId: contentId});
        hit.save(callback);
    }
}

module.exports = HitService;