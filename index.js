require('dotenv').config();
require('better-logging')(console);

const express = require('express');
const app = express();
const server = require('http').Server(app);
const fs = require('fs')
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

    if (data.hasOwnProperty('operacion') && data.hasOwnProperty('resultado')) {
        const nuevaOperacion = {
            operacion: data.operacion,
            resultado: data.resultado,
        };

        fs.readFile(dbFile, 'utf8', (err, fileData) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // Si el archivo no existe
                    const jsonData = [nuevaOperacion];
                    const jsonString = JSON.stringify(jsonData, null, 2);

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
                // Si el archivo existe
                let jsonData = [];

                try {
                    jsonData = JSON.parse(fileData);
                } catch(e) {
                    console.log("El archivo está vacío")
                }
                jsonData.push(nuevaOperacion);
                const jsonString = JSON.stringify(jsonData, null, 2);

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

app.get('/historial', (req, res) => {
    fs.readFile(dbFile, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al leer el archivo.' });
        } else {
            const jsonData = JSON.parse(data);
            console.log(jsonData)
            res.status(200).json(jsonData);
        }
    });
})

// Encendemos el servidor
server.listen(process.env.PORT || 3000, () => {
    console.info(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
});