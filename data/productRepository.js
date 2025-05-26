// -----------------------------------------------------
// data/productRepository.js
// Capa de acceso a datos para productos
// -----------------------------------------------------
const { sql } = require('../config/db');

class ProductRepository {
    // Obtiene todos los productos con su precio actual
    async getAllProducts() {
        try {
            const result = await sql.query(`
                SELECT
                    p.id_producto,
                    p.codigo_producto,
                    p.nombre,
                    p.modelo,
                    p.stock,
                    p.imagen,
                    m.nombre AS marca_nombre,
                    c.nombre AS categoria_nombre,
                    pp.valor AS precio_actual,
                    prom.nombre AS promocion_nombre,
                    prom.porcentaje_descuento
                FROM Productos p
                LEFT JOIN Marcas m ON p.id_marca = m.id_marca
                LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
                LEFT JOIN Precios_Producto pp ON p.id_producto = pp.id_producto
                LEFT JOIN Promociones prom ON p.id_promocion = prom.id_promocion
                WHERE p.estado = 1
                AND pp.fecha = (SELECT MAX(fecha) FROM Precios_Producto WHERE id_producto = p.id_producto)
                ORDER BY p.nombre;
            `);
            return result.recordset;
        } catch (err) {
            console.error('Error en ProductRepository.getAllProducts:', err.message);
            throw new Error('Error al obtener productos.');
        }
    }

    // Obtiene un producto por ID con su historial de precios
    async getProductById(id) {
        try {
            const productResult = await sql.query`
                SELECT
                    p.id_producto,
                    p.codigo_producto,
                    p.nombre,
                    p.modelo,
                    p.stock,
                    p.imagen,
                    m.nombre AS marca_nombre,
                    c.nombre AS categoria_nombre,
                    prom.nombre AS promocion_nombre,
                    prom.porcentaje_descuento
                FROM Productos p
                LEFT JOIN Marcas m ON p.id_marca = m.id_marca
                LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
                LEFT JOIN Promociones prom ON p.id_promocion = prom.id_promocion
                WHERE p.id_producto = ${id} AND p.estado = 1;
            `;

            if (productResult.recordset.length === 0) {
                return null;
            }

            const product = productResult.recordset[0];

            const pricesResult = await sql.query`
                SELECT fecha, valor
                FROM Precios_Producto
                WHERE id_producto = ${id}
                ORDER BY fecha DESC;
            `;
            product.precios = pricesResult.recordset;

            return product;
        } catch (err) {
            console.error('Error en ProductRepository.getProductById:', err.message);
            throw new Error('Error al obtener el producto.');
        }
    }
}

module.exports = new ProductRepository();