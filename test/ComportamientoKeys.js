require('should');

describe('Key Warehouse', function() {
    var KeyWarehouse = require('../model/keyWarehouse');
    var mongoose = require('mongoose');

    if (!mongoose.connection.db) {
        mongoose.connect('mongodb://localhost/test');
    };

    afterEach(function(done){
        KeyWarehouse.remove(function(err, element) {
            done(err);
        });
    });

    it('debe almacenar un par clave pública/privada', function(done) {
        KeyWarehouse.create(function(err, element) {
            if (err) return done(err);

            element.o.should.not.be.empty;
            element.p.should.not.be.empty;
            done();
        }); 
    });

    it('debe recuperar una clave privada a partir de una publica', function(done) {
        KeyWarehouse.create(function(err, element) {
            if (err) return done(err);

            var public = element.o;
            var private = element.p;

            KeyWarehouse.getPrivateKey(public, function(err, element) {
                if (err) throw done(err);

                element.p.should.equal(private);
                done();
            });            
        }); 
    });
});