const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const server = require('http').Server(app);
const fs = require('fs')
const { renderView } = require('./src/helpers/renderView');
const port = process.env.PORT


app.use(express.json());
app.set('view engine', 'ejs');



// Agregamos rutas al servidor
app.get('/', (req, res) => {
    renderView(res, 'calculator');
});

const dbFile = 'operaciones.json';

// Ruta para agregar una operación al historial
app.post('/agregar-operacion', (req, res) => {
    const data = req.body;

    // Verificar si la solicitud contiene una operación y un resultado
    if (data.hasOwnProperty('operacion') && data.hasOwnProperty('resultado')) {
        const nuevaOperacion = {
            operacion: data.operacion,
            resultado: data.resultado,
        };

        fs.readFile(dbFile, 'utf8', (err, fileData) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al leer el archivo JSON' });
                return;
            }

            const historial = JSON.parse(fileData);
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

// Encendemos el servidor
server.listen(port, () => {
    console.info(`Servidor corriendo en el puerto ${port}` );
});