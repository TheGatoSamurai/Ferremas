// -----------------------------------------------------
// services/productService.js
// Capa de lógica de negocio para productos
// -----------------------------------------------------
const productRepository = require('../data/productRepository');

// INICIO DE CAMBIOS PARA WEBPAY
// Importa los módulos necesarios del SDK de Transbank
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes, WebpayPlus } = require("transbank-sdk");

// Configuración de Webpay
// IMPORTANTE: Usa tus credenciales de producción aquí para entornos de producción.
// Para integración, usa los códigos y claves de integración proporcionados por Transbank.
const webpayOptions = new Options(
    process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS, // Usa variable de entorno o código de integración por defecto
    process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY,                 // Usa variable de entorno o clave de integración por defecto
    process.env.WEBPAY_ENVIRONMENT === 'PRODUCTION' ? Environment.Production : Environment.Integration // Define el entorno
);
// FIN DE CAMBIOS PARA WEBPAY

class ProductService {
    async getProducts() {
        return await productRepository.getAllProducts();
    }

    async getProductDetails(id) {
        const product = await productRepository.getProductById(id);
        if (!product) {
            return null;
        }

        if (product.promocion_nombre && product.porcentaje_descuento) {
            // CORRECCIÓN: Asegura que se encuentre el precio más reciente de forma robusta
            const precioActualObj = product.precios.reduce((prev, current) =>
                (new Date(prev.fecha) > new Date(current.fecha)) ? prev : current
            );
            if (precioActualObj) {
                 product.precio_con_descuento = precioActualObj.valor * (1 - product.porcentaje_descuento / 100);
            }
        }

        return product;
    }

    // --- Placeholder para integración con Banco Central de Chile ---
    async convertCurrency(amount, fromCurrency, toCurrency) {
        // En un escenario real, aquí harías una llamada a la API del Banco Central de Chile
        // para obtener las tasas de cambio y realizar la conversión.
        // Ejemplo de URL (esto es un placeholder, consulta la documentación oficial del BCCH):
        // `https://api.bcentral.cl/v1/indicadores/dolar/fecha`
        console.log(`Simulando conversión de ${amount} ${fromCurrency} a ${toCurrency}`);
        // Retorna un valor simulado
        return amount * 850; // Ejemplo: 1 USD = 850 CLP
    }

    // INICIO DE MÉTODOS DE INTEGRACIÓN CON WEBPAY
    async initiateWebpayTransaction(amount, buyOrder, sessionId, returnUrl, finalUrl) {
        console.log(`Iniciando transacción Webpay para orden ${buyOrder} con monto ${amount}`);
        try {
            // Crea una nueva instancia de transacción WebpayPlus con las opciones configuradas
            const tx = new WebpayPlus.Transaction(webpayOptions);
            // Llama al método create del SDK de Transbank para iniciar la transacción
            const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

            // La respuesta de tx.create contendrá el token y la URL de redirección
            return {
                token: response.token,
                url: response.url
            };
        } catch (error) {
            console.error('Error al iniciar transacción Webpay:', error.message);
            throw new Error('Error al conectar con Webpay para iniciar la transacción.');
        }
    }

    async confirmWebpayTransaction(token) {
        console.log(`Confirmando transacción Webpay con token: ${token}`);
        try {
            // Crea una nueva instancia de transacción WebpayPlus con las opciones configuradas
            const tx = new WebpayPlus.Transaction(webpayOptions);
            // Llama al método commit del SDK de Transbank para confirmar la transacción
            const response = await tx.commit(token); // Usa commit para la confirmación

            // Parsea la respuesta de Webpay para determinar el estado
            if (response.response_code === 0) { // Asumiendo que 0 significa éxito para WebpayPlus
                return {
                    status: 'CONFIRMED',
                    message: `Transacción ${token} confirmada exitosamente.`,
                    transactionDetails: {
                        amount: response.amount,
                        cardType: response.card_detail ? response.card_detail.card_number : 'N/A', // Puede estar enmascarado
                        accountingDate: response.accounting_date,
                        transactionDate: response.transaction_date,
                        responseCode: response.response_code,
                        vci: response.vci,
                        // Añade más detalles según sea necesario de la respuesta de Webpay
                    }
                };
            } else {
                return {
                    status: 'REJECTED',
                    message: `Transacción ${token} rechazada. Código de respuesta: ${response.response_code}`,
                    transactionDetails: {
                        responseCode: response.response_code,
                        // Añade más detalles para el rechazo si están disponibles
                    }
                };
            }
        } catch (error) {
            console.error('Error al confirmar transacción Webpay:', error.message);
            throw new Error('Error al conectar con Webpay para confirmar la transacción.');
        }
    }
    // FIN DE MÉTODOS DE INTEGRACIÓN CON WEBPAY
}

module.exports = new ProductService();