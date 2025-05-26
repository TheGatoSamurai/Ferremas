// -----------------------------------------------------
// data/contactRepository.js
// Capa de acceso a datos para contactos
// -----------------------------------------------------
// const { sql } = require('../config/db'); // Ya importado en productRepository, pero se puede importar de nuevo si es un archivo separado

class ContactRepository {
    // Guarda un nuevo mensaje de contacto
    async createContact(nombre, email, telefono, asunto, mensaje) {
        try {
            const result = await sql.query`
                INSERT INTO Contactos (nombre, email, telefono, asunto, mensaje, fecha_consulta, estado)
                VALUES (${nombre}, ${email}, ${telefono}, ${asunto}, ${mensaje}, GETDATE(), 'Pendiente');
            `;
            // En SQL Server, para obtener el ID insertado, se usa SCOPE_IDENTITY()
            // Pero para esta tabla, solo necesitamos confirmar la inserción.
            return result.rowsAffected[0] > 0;
        } catch (err) {
            console.error('Error en ContactRepository.createContact:', err.message);
            throw new Error('Error al guardar el mensaje de contacto.');
        }
    }
}

module.exports = new ContactRepository();