let app = require('./config/custom-express')();
let logger = require('./services/logger');

let porta = process.env.PORT || 3000;

app.listen(porta, function() {
    let msg = 'Servidor rodando iniciado em ' + new Date + ' na porta ' + porta;
    console.log(msg);
    logger.info(msg);
});