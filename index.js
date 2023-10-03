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
// Handles the POST request to '/agregar-operacion' route. 
// Stores the data sent in a JSON file. If the file exists, appends the data to the end of the file. If the file does not exist, creates it.

app.post('/agregar-operacion', (req, res) => {
    const data = req.body;
    console.log(data);

    // Check if the request contains an 'operacion' and 'resultado' field
    if (data.hasOwnProperty('operacion') && data.hasOwnProperty('resultado')) {
        const nuevaOperacion = {
            operacion: data.operacion,
            resultado: data.resultado,
        };

        // Read the existing JSON file, if it exists
        fs.readFile(dbFile, 'utf8', (err, fileData) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // File does not exist, create a new array with the data
                    const jsonData = [nuevaOperacion];
                    const jsonString = JSON.stringify(jsonData, null, 2);

                    // Write the JSON data to the file
                    fs.writeFile(dbFile, jsonString, (err) => {
                        if (err) {
                            console.error(err);
                            res.status(500).json({ error: 'Error al escribir en el archivo.' });
                        } else {
                            res.status(200).json({ message: 'Operación agregada correctamente.' });
                        }
                    });
                } else {
                    console.error(err);
                    res.status(500).json({ error: 'Error al leer el archivo.' });
                }
            } else {
                // File exists, parse the existing JSON data
                let jsonData = [];

                try {
                    jsonData = JSON.parse(fileData);
                } catch(e) {
                    console.log("El archivo está vacío")
                }
                jsonData.push(nuevaOperacion);
                const jsonString = JSON.stringify(jsonData, null, 2);

                // Write the updated JSON data to the file
                fs.writeFile(dbFile, jsonString, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Error al escribir en el archivo.' });
                    } else {
                        res.status(200).json({ message: 'Operación agregada correctamente.' });
                    }
                });
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