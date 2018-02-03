module.exports = function(app) {

    app.post('/correios/calculo-prazo', function(req, res) {
        let dadosEntrega = req.body;

        let correiosSoapService = new app.services.correiosSOAP();
        correiosSoapService.calculaPrazo(dadosEntrega, function(erro, result) {
            if (erro) {
                res.status(500).send(erro);
                return;
            }

            res.json(result);
        });
    });

};