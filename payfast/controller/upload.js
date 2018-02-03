let fs = require('fs');

module.exports = function(app) {

    app.post('/upload/imagem', function(req, res) {
        
        // Body - binary type with image
        // Headers - Content-Type - value: application/octet-stream (envia pequenos pacotes para não sobrecarregar a chamada)
        // Headers - filename - value: Node_Req2.jpg

        let fileName = req.headers.filename;
        req.pipe(fs.createWriteStream('util/' + fileName))
            .on('finish', function() {
                res.status(201).send();
            });

        
    });

};