require('should');

describe('Generación de Hash', function() {
    var KeyWarehouse = require('../model/keyWarehouse');
    var hash = require('../model/hash');
    var mongoose = require('mongoose');

    if (!mongoose.connection.db) {
        mongoose.connect('mongodb://localhost/test');
    };

    afterEach(function(done) {
        KeyWarehouse.remove(function(err, element) {
            done(err);
        });
    });

    it('debe generar un hash para una clave pública existente', function(done) {
        KeyWarehouse.create(function(err, element) {
            if (err) return done(err);

            var public = element.o;
            var contentId = 20121115;
            var service = '/hit';
            hash.getHash(contentId, service, public, function(err, element) {
                if (err) return done(err);

                element.should.be.ok;
                done();
            });
        }); 
    });

    it('debe devolver un error si la clave pública no existe', function(done) {
        var public = 'esta clave no existe';
        var contentId = 20121115;
        var service = '/hit';
        hash.getHash(contentId, service, public, function(err, element) {
            err.should.be.ok;
            done();
        });
    });

    it('debe devolver el mismo hash para la misma clave, contenido y servicio', function(done) {
        KeyWarehouse.create(function(err, element) {
            if (err) return done(err);

            var public = element.o;
            var contentId = 20121115;
            var service = '/hit';
            hash.getHash(contentId, service, public, function(err, element1) {
                if (err) return done(err);

                hash.getHash(contentId, service, public, function(err, element2) {
                    element1.should.equal(element2);
                    done();
                });
            });
        }); 
    });
});