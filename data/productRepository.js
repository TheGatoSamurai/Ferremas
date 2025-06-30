// -----------------------------------------------------
// data/productRepository.js
// Capa de acceso a datos para productos
// -----------------------------------------------------
const { getPool } = require('../config/db');

class ProductRepository {
    async getAllProducts() {
        const pool = getPool();
        let connection;
        try {
            connection = await pool.getConnection();
            const [rows] = await connection.query(`
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
            return rows;
        } catch (err) {
            console.error('Error en ProductRepository.getAllProducts:', err.message);
            throw new Error('Error al obtener productos.');
        } finally {
            if (connection) connection.release();
        }
    }

    async getProductById(id) {
        const pool = getPool();
        let connection;
        try {
            connection = await pool.getConnection();

            const [productRows] = await connection.query(`
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
                WHERE p.id_producto = ? AND p.estado = 1;
            `, [id]);

            if (productRows.length === 0) {
                return null;
            }

            const product = productRows[0];

            const [pricesRows] = await connection.query(`
                SELECT fecha, valor
                FROM Precios_Producto
                WHERE id_producto = ?
                ORDER BY fecha DESC;
            `, [id]);
            product.precios = pricesRows;

            return product;
        } catch (err) {
            console.error('Error en ProductRepository.getProductById:', err.message);
            throw new Error('Error al obtener el producto.');
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = new ProductRepository();
