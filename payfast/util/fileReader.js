let fs = require('fs');

// =================================================================================================
// BUFFER - NÃO RECOMENDADO!!!!!
// =================================================================================================
// Recria o arquivo porem carregando os dados em memória para depois gravar o arquivo. 
// A V8 aguenta no máximo 1G na memória logo utilizando o Stream se garante nunca chegar
// a esta situação. 
// =================================================================================================
fs.readFile('Node.jpg', function(erro, buffer) {
    fs.writeFile('Node_buffer.jpg', buffer, function(erro2) {
    });
});