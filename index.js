require('dotenv').config();
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { renderView } = require('./src/helpers/renderView');

const app = express();
const server = http.createServer(app);

// Configuración de Express
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Lista de clientes conectados para enviar actualizaciones SSE
const clients = [];

// Cargar el historial actual o crearlo si no existe
let historial = [];

try {
    const historialData = fs.readFileSync('historial.json', 'utf-8');
    historial = JSON.parse(historialData);
} catch (err) {
    // Manejar errores, por ejemplo, si el archivo no existe.
    console.log("El archivo historial.json no existe. Creando uno nuevo...");
    fs.writeFileSync('historial.json', JSON.stringify(historial, null, 2), 'utf-8');
}

// Ruta principal
app.get('/', (req, res) => {
    // Pasar 'historial' a la vista 'calculator'
    renderView(res, 'calculator', { historial });
});

// Agregar un nuevo elemento al historial
app.post('/AgregarAlHistorial', (req, res) => {
    console.log(req.body);
    const registro = req.body;

    // Agregar el nuevo dato al historial
    historial.push(registro);

    // Guardar el historial actualizado en el archivo JSON
    fs.writeFileSync('historial.json', JSON.stringify(historial, null, 2), 'utf-8');

    // Enviar una actualización a todos los clientes conectados
    const historialJSON = JSON.stringify(historial);
    clients.forEach(client => {
        client.write(`data: ${historialJSON}\n\n`);
    });

    // Enviar una respuesta al cliente si es necesario
    res.send({ message: 'Historial actualizado' });
});

// Borrar todo el historial
app.post('/BorrarElHistorial', (req, res) => {
    // Borrar el archivo de historial.json
    fs.unlinkSync('historial.json');

    // Borrar el historial
    historial = [];

    // Notificar a todos los clientes SSE que el historial ha sido borrado
    const historialJSON = JSON.stringify(historial);
    clients.forEach(client => {
        client.write('event: BorrarElHistorial\ndata: {}\n\n');
        client.write(`data: ${historialJSON}\n\n`);
    });

    // Responder con un mensaje de éxito o cualquier otra respuesta necesaria
    res.json({ message: 'Historial borrado con éxito' });
});

// Suscribirse a eventos SSE
app.get('/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Agregar el cliente a la lista de clientes conectados
    clients.push(res);

    // Enviar una actualización inicial con el historial actual
    res.write(`data: ${JSON.stringify(historial)}\n\n`);

    // Manejar la desconexión del cliente
    req.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
    });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.info(`Servidor corriendo en el puerto ${port}`);
});