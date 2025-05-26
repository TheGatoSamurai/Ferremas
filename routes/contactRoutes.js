// -----------------------------------------------------
// routes/contactRoutes.js
// Rutas de la API para contactos
// -----------------------------------------------------
const express = require('express');
const contactController = require('../controllers/contactController');
const router = express.Router();

// Ruta para enviar un formulario de contacto
router.post('/contact', contactController.submitContactForm);

module.exports = router;
