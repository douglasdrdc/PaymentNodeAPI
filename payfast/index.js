let app = require('./config/custom-express')();

let porta = process.env.PORT || 3000;

app.listen(porta, function() {
    console.log('Servidor rodando');
});