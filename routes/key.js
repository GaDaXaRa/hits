var KeyWarehouse = require('../model/keyWarehouse');

exports.create = function(req, res) {
    
    KeyWarehouse.create(function(err, element) {
        if (err) {
            res.json({error: 'Error al generar la clave pública'}, 404);
            return;  
        }

        res.json(element.o, 200);
    });
}