// Carga la configuración de las variables de entorno desde un archivo .env
require('dotenv').config();

// Habilita mejoras en la salida de registro en la consola
require('better-logging')(console);

const express = require('express');
const app = express();
const server = require('http').Server(app);
const fs = require('fs');

app.use(express.json());

const { renderView } = require('./src/helpers/renderView');

app.set('view engine', 'ejs');

// Ruta principal que muestra el historial desde un archivo JSON
app.get('/', (req, res) => {
    // Lee los datos de registro desde el archivo 'historial.json'
    const historialData = fs.readFileSync('historial.json');
    const historial = JSON.parse(historialData);

    // Renderiza la vista 'calculator' y pasa el historial como datos
    renderView(res, 'calculator', { historial });
});

// Ruta para guardar el historial
app.post('/guardar-historial', (req, res) => {
    // Obtiene los datos del cuerpo de la solicitud
    const { historial } = req.body;
  
    // Escribe los datos del historial en el archivo 'historial.json'
    fs.writeFileSync('historial.json', JSON.stringify(historial));
});

// Inicia el servidor y lo hace escuchar en el puerto 3000
server.listen(3000, () => {
    console.info('El servidor está en funcionamiento en el puerto 3000');
});