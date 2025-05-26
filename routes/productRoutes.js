// -----------------------------------------------------
// routes/productRoutes.js
// Rutas de la API para productos
// -----------------------------------------------------
const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

// Ruta para obtener todos los productos
router.get('/products', productController.getAllProducts);

// Ruta para obtener los detalles de un producto por ID
router.get('/products/:id', productController.getProductDetails);

// Ruta de ejemplo para el procesamiento de pagos (placeholder)
router.post('/payment', productController.processPayment);

module.exports = router;
