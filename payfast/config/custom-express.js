let app = require('express')();
let consign = require('consign');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let morgan = require('morgan');
let logger = require('../services/logger');

module.exports = function() {

    app.use(morgan("common", {
        stream: {
            write: function(mensagem) {
                logger.info(mensagem);
            }
        }
    }));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(expressValidator());

    consign()
        .include('controller')
        .then('infra')
        .then('services')
        .into(app);

    return app;
}