var mongoose = require("mongoose");
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var keyWarehouseSchema = new Schema({
    o: {type: String, required: true, trim: true, index: true},
    p: {type: String, required: true, trim: true}
});

keyWarehouseSchema.statics.create = function (callback) {
    var public = uuid.v4();
    var private = uuid.v4();
    var entry = new this({o: public, p: private});
    entry.save(callback);
}

keyWarehouseSchema.statics.getPrivateKey = function (public, callback) {
    this.findOne({o: public }, 'p', {safe: true}, callback);
}

module.exports = mongoose.model('KeyWarehouse', keyWarehouseSchema);