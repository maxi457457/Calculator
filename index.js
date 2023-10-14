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
    // Cargar el historial actual desde el archivo "historial.json"
    let historial = [];
    try {
        const historialData = fs.readFileSync('historial.json', 'utf-8');
        historial = JSON.parse(historialData);
    } catch (err) {
        // Manejar errores, por ejemplo, si el archivo no existe o no se puede leer.
        console.log("Error al leer el historial")
    }
    // Agregar el nuevo dato al historial
    historial.push(registro);

    // Guardar el historial actualizado en el archivo JSON
    
    //NO USAR CON NODEMON
    fs.writeFileSync('historial.json', JSON.stringify(historial, null, 2));
});

// Encendemos el servidor
server.listen(process.env.PORT, () => {
    console.info(`Servidor corriendo en el puerto ${process.env.PORT}`);
});