let logger = require('../services/logger');

module.exports = function(app) {

    app.get('/pagamento', function(req, res) {
                
        let connection = app.infra.connectionFactory();
        let pagDAO = new app.infra.pagamentoDAO(connection);

        pagDAO.getAll(function(err, result) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.status(200).send(result);
            }
            connection.end();
            return;
        }); 
    });

    app.get('/pagamento/:id', function(req, res) {
        let id = req.params.id;
        let pagamento = {};
        pagamento.id = id;

        let memcachedClient = app.services.memcachedClient();
        memcachedClient.get('pagamento-' + id, function(err, resultado) {
            if (err || !resultado) {
                let connection = app.infra.connectionFactory();
                let pagDAO = new app.infra.pagamentoDAO(connection);

                pagDAO.getById(pagamento, function(err, result) {
                    if (err) {
                        res.status(500).send(err);
                        logger.error(err);
                    }
                    else {
                        res.status(200).send(result);
                    }
                    connection.end();
                }); 
            } else {                
                res.status(200).send(resultado);
                logger.info('MISS - ' + JSON.stringify(resultado));
            }
        });
    });

    app.post('/pagamento', function(req, res) {
        
        req.assert("pagamento.formaPagamento", "Forma de Pagamento é obrigatória.").notEmpty();
        req.assert("pagamento.valor", "Valor é obrigatória e deve ter formato decimal.").notEmpty().isFloat();
        req.assert("pagamento.moeda", "Moeda é obrigatória e deve conter 3 caracteres.").notEmpty().len(3,3);

        let erros = req.validationErrors();
        if (erros) {
            res.status(400).send(erros);
            return;
        }

        let pagamento = req.body["pagamento"];
        pagamento.status = "Criado";
        pagamento.dataInclusao = new Date;

        let connection = app.infra.connectionFactory();
        let pagDAO = new app.infra.pagamentoDAO(connection);

        pagDAO.insert(pagamento, function(err, result) {
            if (err) {
                res.status(500).send(err);
                logger.error(err);
            }
            else {
                connection.end();                    
                pagamento.id = result.insertId;

                let memcachedClient = app.services.memcachedClient();
                memcachedClient.set('pagamento-' + pagamento.id, pagamento, 60000, function(err, resultado) {});

                if (pagamento.formaPagamento == 'cartao') {
                    let cartao = req.body["cartao"];
                    let cartaoService = new app.services.clienteCartoes();
                    cartaoService.autoriza(cartao, function(erroCartao, reqCartao, resCartao, retornoCartao) {
                        if (erroCartao) {
                            res.status(400).send(erroCartao);
                            logger.error(erroCartao);
                            return;
                        }
                        
                        // Hateoas
                        let response = {
                            dadosPagamento: pagamento,
                            cartao: retornoCartao,
                            links: [
                                {
                                    href: "http://localhost:3000/pagamento/" + pagamento.id,
                                    rel: "Confirmar Pagamento",
                                    method: "PUT"
                                },
                                {
                                    href: "http://localhost:3000/pagamento/" + pagamento.id,
                                    rel: "Cancelar Pagamento",
                                    method: "DELETE"
                                }
                            ]
                        };
                        
                        res.status(201).json(response);                        
                        return;
                    });
                }
                else {
                    res.location('/pagamento/' + pagamento.id) 

                    // Hateoas
                    let response = {
                        dadosPagamento: pagamento,
                        links: [
                            {
                                href: "http://localhost:3000/pagamento/" + pagamento.id,
                                rel: "Confirmar Pagamento",
                                method: "PUT"
                            },
                            {
                                href: "http://localhost:3000/pagamento/" + pagamento.id,
                                rel: "Cancelar Pagamento",
                                method: "DELETE"
                            }
                        ]
                    };
    
                    res.status(201).send(response);
                }
            }            
        });
        
    });

    app.put('/pagamento/:id', function(req, res) {
        let id = req.params.id;
        let pagamento = {};
        pagamento.id = id;
        pagamento.status = "Confirmado";

        let connection = app.infra.connectionFactory();
        let pagDAO = new app.infra.pagamentoDAO(connection);

        pagDAO.update(pagamento, function(err, result) {
            if (err) {
                res.status(500).send(err);
                logger.error(err);
            }
            else {

                pagDAO.getById(pagamento, function(errGet, resultGet) {
                    if (err) {
                        res.status(500).send(errGet);
                        logger.error(errGet);
                    }
                    else
                    {
                        let memcachedClient = app.services.memcachedClient();
                        memcachedClient.set('pagamento-' + pagamento.id, resultGet, 60000, function(err, resultado) {});

                        res.status(200).send(resultGet);
                    }
                });                
            }
            connection.end();
        }); 
    });

    app.delete('/pagamento/:id', function(req, res) {
        let id = req.params.id;
        let pagamento = {};
        pagamento.id = id;
        pagamento.status = "Cancelado";
        
        let connection = app.infra.connectionFactory();
        let pagDAO = new app.infra.pagamentoDAO(connection);

        pagDAO.delete(pagamento, function(err, result) {
            if (err) {
                res.status(500).send(err);
                logger.error(err);
            }
            else {
                pagDAO.getById(pagamento, function(errGet, resultGet) {
                    if (err) {
                        res.status(500).send(errGet);
                        logger.error(errGet);
                    }
                    else
                    {
                        let memcachedClient = app.services.memcachedClient();
                        memcachedClient.set('pagamento-' + pagamento.id, resultGet, 60000, function(err, resultado) {});
                        
                        res.status(204).send(resultGet);
                    }
                });                
            }
            connection.end();
        }); 
    });


}