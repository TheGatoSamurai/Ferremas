// -----------------------------------------------------
// config/db.js
// Configuración de la conexión a la base de datos SQL Server
// -----------------------------------------------------
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // Puedes usar 'localhost' o la IP/nombre del servidor
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'false', // Usa true para Azure SQL Database, false para SQL Server local si no tienes SSL
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'false' // Cambia a true para desarrollo/pruebas si no tienes un certificado de confianza
    }
};

async function connectDb() {
    try {
        await sql.connect(config);
        console.log('Conectado a la base de datos SQL Server.');
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1); // Sale de la aplicación si no puede conectar a la DB
    }
}

// Exporta la conexión para ser usada en otros módulos
module.exports = {
    sql,
    connectDb
};