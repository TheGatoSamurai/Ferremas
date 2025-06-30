// -----------------------------------------------------
// services/productService.js
// Capa de lógica de negocio para productos
// -----------------------------------------------------
const productRepository = require('../data/productRepository');
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes, WebpayPlus } = require("transbank-sdk");

// Configuración de Webpay
const webpayOptions = new Options(
    process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS,
    process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY,
    process.env.WEBPAY_ENVIRONMENT === 'PRODUCTION' ? Environment.Production : Environment.Integration
);

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
            const precioActualObj = product.precios.reduce((prev, current) =>
                (new Date(prev.fecha) > new Date(current.fecha)) ? prev : current
            );
            if (precioActualObj) {
                 product.precio_con_descuento = precioActualObj.valor * (1 - product.porcentaje_descuento / 100);
            }
        }

        return product;
    }

    // --- INTEGRACIÓN CON LA API DEL BANCO CENTRAL DE CHILE (mindicador.cl) ---
    /**
     * Obtiene el valor actual del dólar y, opcionalmente, convierte un monto.
     * @param {number} [amountToConvert=null] - El monto a convertir desde CLP a USD.
     * @returns {Promise<{dolar_value: number, converted_amount: number|null}>} El valor del dólar y el monto convertido.
     */
    async getDolarExchangeRate(amountToConvert = null) {
        try {
            // URL de la API de mindicador.cl para el dólar de hoy
            const response = await fetch('https://mindicador.cl/api/dolar');
            if (!response.ok) {
                throw new Error(`Error al obtener datos del dólar: ${response.statusText}`);
            }
            const data = await response.json();

            // mindicador.cl devuelve un array en 'serie', el primer elemento es el valor actual
            const dolarValue = data.serie && data.serie.length > 0 ? data.serie[0].valor : null;

            if (!dolarValue) {
                throw new Error('No se pudo obtener el valor del dólar desde la API.');
            }

            let convertedAmount = null;
            if (amountToConvert !== null && typeof amountToConvert === 'number') {
                convertedAmount = amountToConvert / dolarValue; // De CLP a USD
            }

            return {
                dolar_value: dolarValue,
                converted_amount: convertedAmount
            };

        } catch (error) {
            console.error('Error en ProductService.getDolarExchangeRate:', error.message);
            throw new Error(`Error al obtener el valor del dólar: ${error.message}`);
        }
    }


    // --- Métodos de integración con WEBPAY ---
    async initiateWebpayTransaction(amount, buyOrder, sessionId, returnUrl, finalUrl) {
        console.log(`Iniciando transacción Webpay para orden ${buyOrder} con monto ${amount}`);
        try {
            const tx = new WebpayPlus.Transaction(webpayOptions);
            const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

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
            const tx = new WebpayPlus.Transaction(webpayOptions);
            const response = await tx.commit(token);

            if (response.response_code === 0) {
                return {
                    status: 'CONFIRMED',
                    message: `Transacción ${token} confirmada exitosamente.`,
                    transactionDetails: {
                        amount: response.amount,
                        cardType: response.card_detail ? response.card_detail.card_number : 'N/A',
                        accountingDate: response.accounting_date,
                        transactionDate: response.transaction_date,
                        responseCode: response.response_code,
                        vci: response.vci,
                    }
                };
            } else {
                return {
                    status: 'REJECTED',
                    message: `Transacción ${token} rechazada. Código de respuesta: ${response.response_code}`,
                    transactionDetails: {
                        responseCode: response.response_code,
                    }
                };
            }
        } catch (error) {
            console.error('Error al confirmar transacción Webpay:', error.message);
            throw new Error('Error al conectar con Webpay para confirmar la transacción.');
        }
    }
}

module.exports = new ProductService();
