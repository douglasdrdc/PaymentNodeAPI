let cluster = require('cluster');
let os = require('os');

let cpus = os.cpus();

// O cluster Master recebe as requisições e direcionado conforme disponibilidade para cada thred 
if (cluster.isMaster){

    // Para cada nucleo do processador
    cpus.forEach(function() {
        cluster.fork(); // abre uma nova thread
        console.log('nova thread slave');
    });

    cluster.on('listening', worker => {
        console.log('cluster %d conectado', worker.process.pid);
    });

    // Caso o processo seja encerrado sobe o mesmo novamente
    cluster.on('exit', worker => {
        console.log('cluster %d desconectado', worker.process.pid);
        cluster.fork();
    });

}
else{
    console.log('thread slave');
    require('./index.js');
}