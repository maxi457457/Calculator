require('dotenv').config();
require('better-logging')(console);

const express = require('express');
const app = express();
const server = require('http').Server(app);
const fs = require('fs')
// const cors = require('cors');
const dbFile = 'historial.json';

const { renderView } = require('./src/helpers/renderView');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(express.json());

// Agregamos rutas al servidor
app.get('/', (req, res) => {
    renderView(res, 'calculator');
});

// Ruta para agregar una operación al historial
app.post('/agregar-operacion', (req, res) => {
    const data = req.body;
    console.log(data)

    // Verificar si la solicitud contiene una operación y un resultado
    if (data.hasOwnProperty('operacion') && data.hasOwnProperty('resultado')) {
        const nuevaOperacion = {
            operacion: data.operacion,
            resultado: data.resultado,
        };

        // Write the data to the JSON file
        fs.appendFile(dbFile, JSON.stringify(nuevaOperacion) + '\n', (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al escribir en el archivo.' });
            } else {
                res.status(200).json({ message: 'Operación agregada correctamente.' });
            }
        });

    } else {
        res.status(400).json({ error: 'Solicitud incorrecta, se requieren campos "operacion" y "resultado" en el cuerpo.' });
    }
});

// Encendemos el servidor
server.listen(process.env.PORT || 3000, () => {
    console.info(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
});