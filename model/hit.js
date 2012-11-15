var mongoose = require("mongoose")
    , Schema = mongoose.Schema;

var hitSchema = new Schema({
    c: {type: String, required: true, trim: true, index: true},
    t: {type: String, lowercase: true, trim: true},
    b: [{type: String, lowercase: true, trim: true}],
    w: [{type: String, lowercase: true, trim: true}],
    d: {type: Date, default: Date.now}
});

hitSchema.statics.getNumHitsByContentId = function (contentId, callback) {
    this.count({c: contentId}, callback);
}

hitSchema.statics.doHit = function (data, callback) {
    var hit = new this(data);
    hit.save(callback);
}

hitSchema.statics.findMostHitted = function (query, callback) {
    var aggregate = [];

    if (query.startDate || query.endDate) {
        if (query.startDate) {
            if (!query.endDate) {
                aggregate.push({$match: {d: {$gte: query.startDate}}});
            } else {
                aggregate.push({$match: {d: {$gte: query.startDate, $lte: query.endDate}}});  
            }
        } else {
            aggregate.push({$match: {d: {$lte: query.endDate}}});
        }        
    }

    if (query.breadcrum[0]) {
        aggregate.push({$match: {b: {$in: query.breadcrum}}});
    }

    if (query.tags[0]) {
        aggregate.push({$match: {w: {$in: query.tags}}})
    }

    if (query.type) {
        aggregate.push({$match: {t: query.type.toLowerCase()}});
    }

    aggregate.push({$group: {_id: "$c", hits: {$sum : 1}}});
    aggregate.push({$sort: {hits: -1}});    
    aggregate.push({$limit: query.results});

    this.aggregate(aggregate, callback);    
}

module.exports = mongoose.model("Hit", hitSchema);