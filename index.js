require('dotenv').config();
require('better-logging')(console);

const express = require('express');
const app = express();
const server = require('http').Server(app);
const fs = require('fs');

app.use(express.json());

const { renderView } = require('./src/helpers/renderView');

app.set('view engine', 'ejs');

// Agregamos rutas al servidor
app.get('/', (req, res) => {

    // mostrar el historial del JSON
    const historialData = fs.readFileSync('historial.json');
    const historial = JSON.parse(historialData);

    renderView(res, 'calculator', { historial });
});

app.post('/guardar-historial', (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { historial } = req.body;
  
    fs.writeFileSync('historial.json', JSON.stringify(historial));
});

// Encendemos el servidor
server.listen(process.env.PORT, () => {
    console.info(`Servidor corriendo en el puerto ${process.env.PORT}`);
});