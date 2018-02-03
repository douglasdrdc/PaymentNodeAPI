var memcached = require('memcached');

function createMencachedClient() {
    var cliente = new memcached('localhost:11211', {
        retries: 10, // quantidade de tentaivas de buscar o registro nos nós do memcached
        retry: 10000, // tempo de espera entre a falha de um nó e a proxima tentaiva
        revove: true // Permite remover um nó que esteja morto
    });
    return cliente;
}


module.exports = function() {
    return createMencachedClient;
};