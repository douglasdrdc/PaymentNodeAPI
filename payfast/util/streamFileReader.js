let fs = require('fs');

// =================================================================================================
// Recria o arquivo porem na medida que a imagem esta sendo lida já disparada e escrita de 
// forma simultânea. A V8 aguenta no máximo 1G na memória logo utilizando o Stream se garante
// nuca chegar a esta situação.
// =================================================================================================
fs.createReadStream('Node.jpg')
    .pipe(fs.createWriteStream('Node_Stream.jpg')) // escreve os dados assim que eles são lidos de forma paralela
    .on('finish', function() { // fica escutando quando os dois fluxos terminarem
        console.log('arquivo criado com sucesso!');
    });