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

app.post('/update-history', (req, res) => {
  const updatedHistory = JSON.stringify(req.body);
  fs.writeFileSync('history.json', updatedHistory);
  res.sendStatus(200);
});

// Agregamos rutas al servidor
app.get('/', (req, res) => {
    renderView(res, 'calculator');
});

// Encendemos el servidor
server.listen(process.env.PORT || 3000, () => {
    console.info(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
});