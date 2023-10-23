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

    historial.push(registro);
    fs.writeFileSync('HIST.json', JSON.stringify(historial, null, 2));
});

// Encendemos el servidor
server.listen(process.env.PORT, () => {
    console.info(`Servidor corriendo en el puerto: http://localhost:${process.env.PORT}`);
});