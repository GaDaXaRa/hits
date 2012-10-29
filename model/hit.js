var mongoose = require("mongoose")
    , Schema = mongoose.Schema;

var hitSchema = new Schema({
    contentId: String,
    type: String,
    breadCrum: [String],
    tags: [String],
    date: {type: Date, default: Date.now}
});

hitSchema.statics.getNumHitsByContentId = function (contentId, callback) {
    this.count({contentId: contentId}, callback);
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
                aggregate.push({$match: {date: {$gte: query.startDate}}});
            } else {
                aggregate.push({$match: {date: {$gte: query.startDate, $lte: query.endDate}}});  
            }
        } else {
            aggregate.push({$match: {date: {$lte: query.endDate}}});
        }        
    }

    if (query.breadcrum[0]) {
        aggregate.push({$match: {breadCrum: {$in: query.breadcrum}}});
    }

    if (query.tags[0]) {
        aggregate.push({$match: {tags: {$in: query.tags}}})
    }

    if (query.type) {
        aggregate.push({$match: {type: query.type}});
    }

    aggregate.push({$group: {_id: "$contentId", hits: {$sum : 1}}});
    aggregate.push({$sort: {hits: -1}});    
    aggregate.push({$limit: query.results});

    this.aggregate(aggregate, callback);    
}

module.exports = mongoose.model("Hit", hitSchema);