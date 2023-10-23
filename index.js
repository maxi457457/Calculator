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

const dbFile = 'historial.json';


/*app.post('/historial.json', (req, res) => {
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
                return res.status(500).json({ error: 'Error al leer el archivo JSON' });
            }
        
            let historial = [];
        
            try {
                // Intentar analizar el contenido del archivo como JSON
                historial = JSON.parse(fileData);
            } catch (jsonError) {
                // Manejar errores al analizar JSON
                console.error(jsonError);
                return res.status(500).json({ error: 'Error al analizar el contenido JSON del archivo' });
            }
        
            historial.push(nuevaOperacion);
        
            fs.writeFile(dbFile, JSON.stringify(historial), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error al escribir en el archivo JSON' });
                } else {
                    return res.json({ message: 'Operación y resultado guardados con éxito' });
                }
            });
        });
    } else {
        res.status(400).json({ error: 'Solicitud incorrecta, se requieren campos "operacion" y "resultado" en el cuerpo.' });
    }
});*/

// Encendemos el servidor
server.listen(process.env.PORT || 3000, () => {
    console.info(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
});

