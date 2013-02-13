require('should');

describe("REST API", function() {
    var request = require('supertest');
    var app = require('../app.js');
    var Hit = require('../model/hit');
    var KeyWarehouse = require('../model/keyWarehouse');

    var service = 'hit';
    var contentId1 = '2012103100001';
    var contentId2 = '2012103100021';
    var API_Key;
    var hashContent1;
    var hashContent2;

    before(function(done) {
        KeyWarehouse.create(function(err, key) {
            API_Key = key.o;
            request(app)
                .get('/hash/' + contentId1 + '/' + service + '/' + API_Key)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    
                    hashContent1 = res.body;
                    request(app)
                        .get('/hash/' + contentId2 + '/' + service + '/' + API_Key)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) return done(err);
                            hashContent2 = res.body;
                            done();
                        });
                });
            
        });        
    });

    after(function(done) {
        KeyWarehouse.remove(function(err, element) {
            done(err);
        });
    })

    afterEach(function(done) {
        Hit.remove(function(err, element) {
            done(err);
        });
    })

    it('debe almacenar un hit y recuperarlo', function(done) {  
        request(app)
            .post('/hit')
            .send({contentId: contentId1, hash: hashContent1, key: API_Key})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                request(app)
                    .get('/hit/all/all/1/none/1')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);

                        res.body[0]._id.should.equal(contentId1);
                        res.body[0].hits.should.equal(1);
                        done();
                    });
            });           
    });

    it('debe recuperar el elemento con más hits', function(done) {        
        request(app)
            .post('/hit')
            .send({contentId: contentId1, hash: hashContent1, key: API_Key})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                request(app)
                    .post('/hit')
                    .send({contentId: contentId1, hash: hashContent1, key: API_Key})
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        request(app)
                            .post('/hit')
                            .send({contentId: contentId2, hash: hashContent2, key: API_Key})
                            .expect(200)
                            .end(function(err, res) {
                                if (err) return done(err);
                                request(app)
                                    .get('/hit/all/all/1/none/1')
                                    .expect(200)
                                    .end(function(err, res) {
                                        if (err) return done(err);
                                        res.body[0]._id.should.equal(contentId1);
                                        res.body[0].hits.should.equal(2);
                                        done();
                                    })
                            });
                    });
            });        
    });

    it('debe recuperar el elemento con más hits por sección', function(done) {
        request(app)
            .post('/hit')
            .send({contentId: contentId1, hash: hashContent1, key: API_Key, breadcrum: ["Home", "Noticias"]})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                request(app)
                    .post('/hit')
                    .send({contentId: contentId1, hash: hashContent1, key: API_Key, breadcrum: ["Home", "Noticias"]})
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        request(app)
                            .post('/hit')
                            .send({contentId: contentId2, hash: hashContent2, key: API_Key, breadcrum: ["Home", "Noticias", "Deportes"]})
                            .expect(200)
                            .end(function(err, res) {
                                if (err) return done(err);
                                request(app)
                                    .get('/hit/Deportes/all/1/none/1')
                                    .expect(200)
                                    .end(function(err, res) {
                                        if (err) return done(err);
                                        res.body[0]._id.should.equal(contentId2);
                                        res.body[0].hits.should.equal(1);
                                        done();
                                    })
                            });
                    });
            });
    });

    it('debe recuperar el elemento con más hits por tag', function(done) {
        request(app)
            .post('/hit')
            .send({contentId: contentId1, hash: hashContent1, key: API_Key, tags: ["Noticias"]})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                request(app)
                    .post('/hit')
                    .send({contentId: contentId1, hash: hashContent1, key: API_Key,  tags: ["Noticias"]})
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        request(app)
                            .post('/hit')
                            .send({contentId: contentId2, hash: hashContent2, key: API_Key,  tags: ["Deportes"]})
                            .expect(200)
                            .end(function(err, res) {
                                if (err) return done(err);
                                request(app)
                                    .get('/hit/all/all/1/Deportes/1')
                                    .expect(200)
                                    .end(function(err, res) {
                                        if (err) return done(err);
                                        res.body[0]._id.should.equal(contentId2);
                                        res.body[0].hits.should.equal(1);
                                        done();
                                    })
                            });
                    });
            });
    });

    it('debe recuperar el elemento con más hits por tipo de contenido', function(done) {
        request(app)
            .post('/hit')
            .send({contentId: contentId1, hash: hashContent1, key: API_Key, type: "Video"})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                request(app)
                    .post('/hit')
                    .send({contentId: contentId1, hash: hashContent1, key: API_Key, type: "Video"})
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        request(app)
                            .post('/hit')
                            .send({contentId: contentId2, hash: hashContent2, key: API_Key, type: "Noticia"})
                            .expect(200)
                            .end(function(err, res) {
                                if (err) return done(err);
                                request(app)
                                    .get('/hit/all/Noticia/1/none/1')
                                    .expect(200)
                                    .end(function(err, res) {
                                        if (err) return done(err);
                                        res.body[0]._id.should.equal(contentId2);
                                        res.body[0].hits.should.equal(1);
                                        done();
                                    })
                            });
                    });
            });
    });

    it('debe devolver forbidden si se hace hit dos veces al mismo contenido con el mismo sessionID', function(done) {
        var sessionID = 'abc546546';
        request(app)
            .post('/hit')
            .send({contentId: contentId1, hash: hashContent1, key: API_Key})
            .set('req.sessionID', sessionID)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);

                request(app)
                    .post('/hit')
                    .send({contentId: contentId1, hash: hashContent1, key: API_Key})
                    .set('req.sessionID', sessionID)
                    .expect(403, done);
            });
    });
});