// -----------------------------------------------------
// controllers/productController.js
// Capa de controladores para productos (maneja solicitudes HTTP)
// -----------------------------------------------------
const productService = require('../services/productService');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const products = await productService.getProducts();
            res.json(products);
        } catch (error) {
            console.error('Error en ProductController.getAllProducts:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al obtener productos.' });
        }
    }

    async getProductDetails(req, res) {
        try {
            const { id } = req.params;
            const product = await productService.getProductDetails(id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado.' });
            }
            res.json(product);
        } catch (error) {
            console.error('Error en ProductController.getProductDetails:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al obtener el producto.' });
        }
    }

    // --- Endpoint para iniciar una transacción Webpay ---
    async initiateWebpay(req, res) {
        try {
            const { amount, buyOrder, sessionId, returnUrl, finalUrl } = req.body;

            if (!amount || !buyOrder || !returnUrl || !finalUrl) {
                return res.status(400).json({ message: 'Faltan parámetros requeridos para iniciar la transacción Webpay.' });
            }

            const transaction = await productService.initiateWebpayTransaction(amount, buyOrder, sessionId, returnUrl, finalUrl);
            res.status(200).json(transaction);
        } catch (error) {
            console.error('Error en ProductController.initiateWebpay:', error.message);
            res.status(500).json({ message: 'Error al iniciar la transacción Webpay.' });
        }
    }

    // --- Endpoint para confirmar una transacción Webpay ---
    async confirmWebpay(req, res) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ message: 'Token de transacción no proporcionado para la confirmación.' });
            }

            const confirmationResult = await productService.confirmWebpayTransaction(token);
            res.status(200).json(confirmationResult);
        } catch (error) {
            console.error('Error en ProductController.confirmWebpay:', error.message);
            res.status(500).json({ message: 'Error al confirmar la transacción Webpay.' });
        }
    }

    // --- NUEVO Endpoint para obtener el valor del dólar ---
    async getDolarExchangeRate(req, res) {
        try {
            const amount = req.query.amount ? parseFloat(req.query.amount) : null; // Obtener monto de la query string
            if (amount !== null && isNaN(amount)) {
                return res.status(400).json({ message: 'El parámetro "amount" debe ser un número válido.' });
            }

            const result = await productService.getDolarExchangeRate(amount);
            res.json(result);
        } catch (error) {
            console.error('Error en ProductController.getDolarExchangeRate:', error.message);
            res.status(500).json({ message: 'Error al obtener el valor del dólar.' });
        }
    }
}

module.exports = new ProductController();
