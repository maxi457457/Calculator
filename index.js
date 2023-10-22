const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const server = require('http').Server(app);
const fs = require('fs');
const { renderPage } = require('./src/helpers/renderView');
const port = process.env.PORT || 3000;
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
            fecha: new Date() 
        };

        fs.readFile("historial.json", 'utf8', (err, fileData) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al leer el archivo JSON' });
                return;
            }
        
            let historial = [];
        
            if (fileData) {
                try {
                    historial = JSON.parse(fileData);
                } catch (parseError) {
                    console.error(parseError);
                    res.status(500).json({ error: 'Error al parsear el archivo JSON' });
                    return;
                }
            }
        
            historial.push(nuevaOperacion);
        
            fs.writeFile("historial.json", JSON.stringify(historial), (err) => {
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

