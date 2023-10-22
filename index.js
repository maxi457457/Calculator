require('dotenv').config();
require('better-logging')(console);

const express = require('express');
const app = express();
const server = require('http').Server(app);

const { renderView } = require('./src/helpers/renderView');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(express.json());

// Agregamos rutas al servidor
app.get('/', (req, res) => {
    renderView(res, 'calculator');
});

// Encendemos el servidor
server.listen(process.env.PORT, () => {
    console.info(`Servidor corriendo en el puerto ${process.env.PORT}`);
});