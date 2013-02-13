require('should');

describe("NonceService", function() {
    var Nonce = require('../model/nonce');
    var uuid = require('node-uuid');
    var mongoose = require('mongoose');

    if (!mongoose.connection.db) {
        mongoose.connect('mongodb://localhost/test');
    };

    afterEach(function(done){
        Nonce.remove(function(err, element) {
            done(err);
        });
    });

    it('debe almacenar un nonce', function(done) {
        var nonce = uuid.v4();
        Nonce.store(nonce, function(err, element) {
            if (err) done(err);

            element.n.should.equal(nonce);
            done();
        });
    });

    it('debe fallar si se intenta insertar el mismo nonce más de una vez', function(done) {
        var nonce = uuid.v4();
        Nonce.store(nonce, function(err, element) {
            if (err) done(err);

            Nonce.store(nonce, function(err, element) {
                err.code.should.equal(11000); //código de mongo para clave duplicada
                done();
            });
        });
    });

    it('debe devolver true si se pregunta por un nonce que existe previamente', function(done) {
        var nonce = uuid.v4();
        Nonce.store(nonce, function(err, element) {
            if (err) return done(err);

            Nonce.exist(nonce, function(err, element) {
                element.should.be.ok;
                done();
            });
        });
    });

    it('debe devolver false si se pregunta por un nonce que no existe', function(done) {
        var nonce = uuid.v4();

        Nonce.exist(nonce, function(err, element) {
            if (err) return done(err);

            element.should.not.be.ok;
            done();
        });
    });
});