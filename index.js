const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const server = require('http').Server(app);
const fs = require('fs');
const { renderPage } = require('./src/helpers/renderView');
const port = process.env.PORT || 3000; // Si el puerto no está definido en el archivo .env, usa el puerto 3000
const dbFile = 'historial.json';

app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    renderPage(res, 'calculator');
});

app.post('/agregar-operacion', (req, res) => {
    const data = req.body;

    if (data.hasOwnProperty('operacion') && data.hasOwnProperty('resultado')) {
        const nuevaOperacion = {
            operacion: data.operacion,
            resultado: data.resultado,
            fecha: new Date() // Agregar la fecha y hora de la operación
        };

        fs.readFile(dbFile, 'utf8', (err, fileData) => {
            let historial = [];

            if (!err) {
                historial = JSON.parse(fileData);
            }

            historial.push(nuevaOperacion);

            fs.writeFile(dbFile, JSON.stringify(historial), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Error al escribir en el archivo JSON' });
                } else {
                    res.json({ message: 'Operación y resultado guardados con éxito' });
                }
            });
        });
    } else {
        res.status(400).json({ error: 'Solicitud incorrecta, se requieren campos "operacion" y "resultado" en el cuerpo.' });
    }
});

server.listen(port, () => {
    console.info(`Servidor corriendo en el puerto ${port}`);
});

