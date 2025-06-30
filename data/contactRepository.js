// -----------------------------------------------------
// data/contactRepository.js
// Capa de acceso a datos para contactos
// -----------------------------------------------------
const { getPool } = require('../config/db');

class ContactRepository {
    async createContact(nombre, email, telefono, asunto, mensaje) {
        const pool = getPool();
        let connection;
        try {
            connection = await pool.getConnection();
            const [result] = await connection.query(
                `INSERT INTO Contactos (nombre, email, telefono, asunto, mensaje, fecha_consulta, estado)
                 VALUES (?, ?, ?, ?, ?, NOW(), 'Pendiente');`,
                [nombre, email, telefono, asunto, mensaje]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error('Error en ContactRepository.createContact:', err.message);
            throw new Error('Error al guardar el mensaje de contacto.');
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = new ContactRepository();
