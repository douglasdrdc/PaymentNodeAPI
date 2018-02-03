let app = require('./config/custom-express')();

let porta = process.env.PORT || 3001;

app.listen(porta, function() {
    console.log('Servidor de cartões rodando');
});