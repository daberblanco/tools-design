// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage(); // Configurar multer para usar memoryStorage
const upload = multer({ storage: storage });
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Ruta para subir imágenes con Multer como middleware para manejar los archivos
router.post('/', upload.array('images'), uploadController.uploadImages);

module.exports = router;
