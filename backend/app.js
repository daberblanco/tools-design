// app.js

const express = require('express');
const app = express();
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');

// Middleware para procesar datos JSON
app.use(express.json());

// Configurar CORS
app.use(cors());

// Rutas de subida de imágenes
app.use('/upload', uploadRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
