var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var nonceSchema = new Schema({
    n: {type: String, unique: true},
    d: {type: Date, default: Date.now}
});

nonceSchema.statics.store = function(nonce, callback) {
    var entry = new this({n: nonce});
    entry.save(callback);
}

nonceSchema.statics.exist = function(nonce, callback) {
    this.count({n: nonce}, function(err, count) {
        callback(err, count);
    });
}

module.exports = mongoose.model("Nonce", nonceSchema);