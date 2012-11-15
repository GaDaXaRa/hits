require('should');

describe("HitService", function() {
    var Hit = require('../model/hit')
    , _ = require('underscore')
    , mongoose = require('mongoose')
    , Query = require('../model/query');

    if (!mongoose.connection.db) {
      mongoose.connect('mongodb://localhost/test');
    };

    afterEach(function(done){
        Hit.remove(function(err, element) {
            done(err);
        });
    })

    it('debe almacenar hit', function(done) {
        Hit.doHit({c: "20121011-PAGE-00001"}, function(err, element) {
            if (err) return done(err);
            element.c.should.equal("20121011-PAGE-00001");
            done();
        })        
    })

    it('debe aumentar en uno el número de hits en cada llamada', function (done) {
        Hit.doHit({c: "20121011-PAGE-00001"}, function(err, element) {
            if (err) return done(err);
            Hit.doHit({c: "20121011-PAGE-00001"}, function(err, element) {
                if (err) return done(err);
                Hit.doHit({c: "20121011-PAGE-00001"}, function(err, element) {
                    if (err) return done(err);
                    Hit.getNumHitsByContentId("20121011-PAGE-00001", function(err, count) {
                        count.should.equal(3);
                        done();
                    });                    
                })
            })
        })
    })

    it('debe almacenar la fecha actual', function(done) {
        var date = new Date();
        Hit.doHit({c: "20121015-PAGE-00001"}, function (err, element) {
            if (err) return done(err);            
            var hitStartDate = element.d;

            hitStartDate.getFullYear().should.equal(date.getFullYear());
            hitStartDate.getDate().should.equal(date.getDate());
            hitStartDate.getMonth().should.equal(date.getMonth());
            hitStartDate.getHours().should.equal(date.getHours());    
            done();       
        })
    })

    it('debe devolver el contenido con más hits entre tres contenidos', function(done) {
        var query = new Query();
        makeHits(function() {
           
            Hit.findMostHitted(query, function(err, element) {
                if (err) return done(err);
                element[0]._id.should.equal("20121016-PAGE_00003");
                done();
            })        
        })        
    })

    it('debe devolver el contenido con más hits entre dos fechas', function (done) {        
        var date5Days = new Date;
        date5Days.setDate(date5Days.getDate() + 5);

        var date2Days = new Date;
        date2Days.setDate(date2Days.getDate() + 2);

        Hit.doHit({c: "20121016-PAGE_00003", d: date5Days}, function (err, element) {
            Hit.doHit({c: "20121016-PAGE_00003", d: date5Days}, function (err, element) {
                Hit.doHit({c: "20121016-PAGE_00001", d: date2Days}, function (err, element) {
                    Hit.doHit({c: "20121016-PAGE_00001", d: date2Days}, function (err, element) {
                        Hit.doHit({c: "20121016-PAGE_00001", d: date2Days}, function (err, element) {
                            var queryStartDate = new Date;
                            queryStartDate.setDate(queryStartDate.getDate() + 3);
                            
                            var query = new Query;
                            query.startDate = queryStartDate;
                            Hit.findMostHitted(query, function(err, element) {
                                if (err) return done(err);
                                element[0]._id.should.equal("20121016-PAGE_00003");
                                done();
                            });    
                        })
                    })
                })
            })
        })        
    })

    it('debe devolver el contenido con más hits para un tipo de contenido dado', function (done) {
        Hit.doHit({c: "20121016-PAGE_00003", t: "Page"}, function(err, element) {
            Hit.doHit({c: "20121016-PAGE_00003", t: "Page"}, function(err, element) {
                Hit.doHit({c: "20121016-PAGE_00003", t: "Page"}, function(err, element) {
                    Hit.doHit({c: "20121016-VIDEO_00003", t: "Video"}, function(err, element) { 
                        Hit.doHit({c: "20121016-VIDEO_00003", t: "Video"}, function(err, element) { 
                            Hit.doHit({c: "20121016-VIDEO_000013", t: "Video"}, function(err, element) {
                                var query = new Query();
                                query.type = "Video";
                                Hit.findMostHitted(query, function(err, element) {
                                    if (err) return done(err);
                                    element[0]._id.should.equal("20121016-VIDEO_00003");
                                    done();
                                });
                            }) 
                        })
                    })
                    
                })
            })            
        })
    })

    it('debe devolver el contenido con más hits para una sección dada', function (done) {
        Hit.doHit({c: "20121016-PAGE_00003", b: ["Home", "Noticias"]}, function (err, element) {
            Hit.doHit({c: "20121016-PAGE_00001", b: ["Home", "Celebrities"]}, function (err, element) {
                Hit.doHit({c: "20121016-PAGE_00001", b: ["Home", "Celebrities"]}, function (err, element) {
                    Hit.doHit({c: "20121016-PAGE_00001", b: ["Home", "Celebrities"]}, function (err, element) {
                        var query = new Query();
                        query.breadcrum = ["Noticias"];
                        Hit.findMostHitted(query, function(err, element) {
                            if (err) return done(err);
                            element[0]._id.should.equal("20121016-PAGE_00003");       
                            query.breadcrum = ["Home"];
                            Hit.findMostHitted(query, function(err, element) {
                                if (err) return done(err);
                                element[0]._id.should.equal("20121016-PAGE_00001");  
                                done();   
                            })                            
                        })
                    })
                })
            })
        })
    })

    it('debe devolver el contenido con más hits para un tag dado', function (done) {
        Hit.doHit({c: "20121016-PAGE_00003", w: ["Home", "Lola"]}, function (err, element) {
            Hit.doHit({c: "20121016-PAGE_00001", w: ["Home", "Mariano Rajoy"]}, function (err, element) {
                Hit.doHit({c: "20121016-PAGE_00003", w: ["Home", "Noticias"]}, function (err, element) {
                    var query = new Query();
                    query.tags = ["Mariano Rajoy"];
                    Hit.findMostHitted(query, function(err, element) {
                        if (err) return done(err);
                        element[0]._id.should.equal("20121016-PAGE_00001");
                        query.tags = ["Home"];
                        Hit.findMostHitted(query, function(err, element) {
                            if (err) return done(err);
                            element[0]._id.should.equal("20121016-PAGE_00003");
                            done();
                        })
                    })
                })
            })
        })
    })

    function makeHits(callback) {          
        Hit.doHit({c: "20121016-PAGE_00003"}, function(err, element) {
            Hit.doHit({c: "20121016-PAGE_00003"}, function(err, element) {
                Hit.doHit({c: "20121016-PAGE_00003"}, function(err, element) {
                    Hit.doHit({c: "20121016-PAGE_00002"}, function(err, element) {
                       Hit.doHit({c: "20121016-PAGE_00002"}, function(err, element) {
                            Hit.doHit({c: "20121016-PAGE_00001"}, function(err, element) {
                                Hit.doHit({c: "20121016-PAGE_00004"}, function(err, element) {
                                    callback();
                                }); 
                            }); 
                        });  
                    }); 
                }); 
            }); 
        });         
    }
})