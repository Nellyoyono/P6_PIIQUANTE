//import du package 'http' qui permet de répondre les requêtes https
const http = require('http');
//import de l'app express
const app = require('./app');

//renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//la fonction normalizePort renvoie un port valide
const port = normalizePort(process.env.PORT || '3000');

//port sur lequel  le serveur tourne
app.set('port', port);

//gestion d'erreur avec la fonctionberrorHandler
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//méthode "createServer" permet de créer le serveur Node "app"
const server = http.createServer(app);

// écoute d'erreurs diverses 
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//un écouteur d'évènements est enregistré sur le port
server.listen(port);
