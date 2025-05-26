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

    // --- Placeholder para integración con WEBPAY ---
    async processPayment(req, res) {
        const { amount, orderId, userId } = req.body;
        console.log(`Simulando procesamiento de pago con WEBPAY para la orden ${orderId} por ${amount}`);
        // Aquí iría la lógica real de WEBPAY
        res.json({ message: 'Procesamiento de pago simulado. Integrar con API de WEBPAY.' });
    }
}

module.exports = new ProductController();