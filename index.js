// // require('dotenv').config();
// // require('better-logging')(console);

// // const express = require('express');
// // const app = express();
// // const server = require('http').Server(app);
// // const { renderView } = require('./src/helpers/renderView');

// // app.set('view engine', 'ejs');

// // // Agregamos rutas al servidor
// // app.get('/', (req, res) => {
// //     renderView(res, 'calculator');
// // });
// // // Encendemos el servidor
// // server.listen(process.env.PORT, () => {
// //     console.info(`Servidor corriendo en el puerto ${process.env.PORT}`);
// // });

// const fs = require('fs');

// require('dotenv').config();
// require('better-logging')(console);

// const express = require('express');
// const app = express();
// const server = require('http').Server(app);
// const { renderView } = require('./src/helpers/renderView');


// app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//   renderView(res, 'calculator');
// });

// // Ruta para obtener el HistorialAdd
// app.get('/HistorialAdd', (req, res) => {
//   try {
//     const HistorialAddData = fs.readFileSync('HistorialAdd.json', 'utf-8');
//     const HistorialAdd = JSON.parse(HistorialAddData);
//     res.json({ HistorialAdd });
//   } catch (error) {
//     console.error('Error al cargar el HistorialAdd:', error);
//     res.status(500).json({ error: 'Error al cargar el HistorialAdd' });
//   }
// });

// // Ruta para guardar un nuevo elemento en el HistorialAdd
// app.post('/HistorialAdd', express.json(), (req, res) => {
//     try {
//       const newItem = req.body; // Debes enviar los datos desde la calculadora
  
//       // Si el archivo existe, cargar el HistorialAdd existente
//       let HistorialAdd = [];
//       if (fs.existsSync('HistorialAdd.json')) {
//         const HistorialAddData = fs.readFileSync('HistorialAdd.json', 'utf-8');
//         HistorialAdd = JSON.parse(HistorialAddData);
//       }
  
//       // Agregar el nuevo elemento
//       HistorialAdd.push(newItem);
  
//       // Guardar el HistorialAdd en el archivo
//       fs.writeFileSync('HistorialAdd.json', JSON.stringify(HistorialAdd, null, 2), 'utf-8');
  
//       res.json({ success: true });
//     } catch (error) {
//       console.error('Error al guardar el HistorialAdd:', error);
//       res.status(500).json({ error: 'Error al guardar el HistorialAdd' });
//     }
//   });

// server.listen(process.env.PORT, () => {
//   console.info(`Servidor corriendo en el puerto ${process.env.PORT}`);
// });


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

app.get('/mostrarHistorial', (req, res) => {
    try {
      const historialData = fs.readFileSync('historial.json', 'utf-8');
      const historial = JSON.parse(historialData);
      res.json({ historial });
    } catch (error) {
      console.error('Error al cargar el historial:', error);
      res.status(500).json({ error: 'Error al cargar el historial' });
    }
  });
  

app.post("/HistorialAdd", (req, res) => {
    console.log(req.body)
    let registro = req.body

    let historial = [];
    try {
        const historialData = fs.readFileSync('historial.json', 'utf-8');
        historial = JSON.parse(historialData);
    } catch (err) {
        console.log("Error al leer el historial")
    }

    historial.push(registro);
    fs.writeFileSync('historial.json', JSON.stringify(historial, null, 2));
});
  

// Encendemos el servidor
server.listen(process.env.PORT, () => {
    console.info(`Servidor corriendo en el puerto: http://localhost:${process.env.PORT}`);
});
