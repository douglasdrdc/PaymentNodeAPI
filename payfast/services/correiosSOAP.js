let soap = require('soap');

function CorreiosSoapService() {
    this._urlBase = 'http://ws.correios.com.br/';
}

CorreiosSoapService.prototype.calculaPrazo = function (dadosEntrega, callback) {
    let url = this._urlBase + 'calculador/CalcPrecoPrazo.asmx?wsdl';

    soap.createClient(url, function(erro, cliente) {
        cliente.CalcPrazo(dadosEntrega, callback);
    });
};

module.exports = function() {
    return CorreiosSoapService;
}