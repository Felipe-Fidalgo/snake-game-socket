const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const routes = require('./routes/routes');

app.use(cors());
app.use(express.json());

// Serving static files from 'public' folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// View engine setup
app.set('views', path.join(__dirname, '..', 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', routes);

io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.on('comand', (data) => {
        console.log('recebe: ' + data);
        socket.broadcast.emit('fs-share', data);
    });

    socket.on('fs-share', (data) => {
        console.log('envia: ' + data);
        socket.broadcast.emit('fs-share', data);
    });

    socket.on('disconnect', () => {
        console.log(`Socket desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
 