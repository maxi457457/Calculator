require('dotenv').config();
require('better-logging')(console);

const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const { renderView } = require('./src/helpers/renderView');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.post('/save', (req, res) => {
  const calculations = req.body;
  fs.writeFile('calculations.json', JSON.stringify(calculations), (err) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error al guardar el archivo JSON.' });
      } else {
          res.json({ message: 'Archivo JSON actualizado exitosamente.' });
      }
  });
});

// Agregamos rutas al servidor
app.get('/', (req, res) => {
    renderView(res, 'calculator');
});

// Encendemos el servidor
server.listen(process.env.PORT || 3000, () => {
    console.info(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
});