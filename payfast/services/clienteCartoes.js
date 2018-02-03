let restify = require('restify-clients');

function ClienteCartoesService() {
    this._cliente = restify.createJsonClient({
        url: 'http://localhost:3001'
    });
}

ClienteCartoesService.prototype.autoriza = function(cartao, callback) {
    
    this._cliente.post('/cartao/autoriza', cartao, callback);    
    
};

module.exports = function() {
    return ClienteCartoesService;
}