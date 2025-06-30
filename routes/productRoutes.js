// -----------------------------------------------------
// routes/productRoutes.js
// Rutas de la API para productos, Webpay y valor del dólar
// -----------------------------------------------------
const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

// Rutas de productos
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductDetails);

// Rutas de Webpay
router.post('/webpay/initiate', productController.initiateWebpay);
router.post('/webpay/confirm', productController.confirmWebpay);

// NUEVA Ruta para obtener el valor del dólar
router.get('/currency/dolar', productController.getDolarExchangeRate);

module.exports = router;
