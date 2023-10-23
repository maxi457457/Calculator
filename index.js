require('dotenv').config();
require('better-logging')(console);

const express = require('express');
const app = express();
const fs = require("fs")
const cors = require("cors")
const bodyParser = require("body-parser")
const server = require('http').Server(app);

const { renderView } = require('./src/helpers/renderView');

app.set('view engine', 'ejs');
app.use(cors())
app.use(bodyParser.json());
// Agregamos rutas al servidor
app.get('/', (req, res) => {
    renderView(res, 'calculator');
});

app.get('/historial', (req, res) => {
    // Lee el contenido del archivo JSON
    fs.readFile('HIST.json', 'utf8', (err, data) => {
      if (err) {
        // Maneja errores si ocurren al leer el archivo
        console.error(err);
        res.status(500).send('Error interno del servidor');
      } else {
        // Convierte el contenido del archivo en un objeto JSON
        const datos = JSON.parse(data);
  
        // Envía el objeto JSON como respuesta
        res.json(datos);
      }
    });
  });

  app.get('/MostrarHistorial', (req, res) => {
    try {
      const historialData = fs.readFileSync('HIST.json', 'utf-8');
      const historial = JSON.parse(historialData);
      res.json({ historial });
    } catch (error) {
      console.error('Error al cargar el historial:', error);
      res.status(500).json({ error: 'Error al cargar el historial' });
    }
  });




app.post("/HistorialAdd", (req, res) => {
    console.log(req.body)
    let registro = req.body

    let historial = [];
    try {
        const historialData = fs.readFileSync('HIST.json', 'utf-8');
        historial = JSON.parse(historialData);
    } catch (err) {
        console.log("Error al leer el historial")
    }

    historial.unshift(registro);
    fs.writeFileSync('HIST.json', JSON.stringify(historial, null, 2));
});

// Encendemos el servidor
server.listen(process.env.PORT, () => {
    console.info(`Servidor corriendo en el puerto: http://localhost:${process.env.PORT}`);
});
